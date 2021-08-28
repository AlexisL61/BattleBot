import { Client, MessageAttachment, TextChannel } from "discord.js";
import position from "../../types/position";
import Cache from "../cache/Cache";
import Player from "../player/Player";
import MapGenerator from "./MapGenerator";

export default class Map {

    static client:Client;
    static currentMap:Map
    static currentMapUrl:string;

    private _montagneNoise: number;
    public get montagneNoise(): number {
        return this._montagneNoise;
    }
    public set montagneNoise(value: number) {
        this._montagneNoise = value;
    }
    private _forestNoise: number;
    public get forestNoise(): number {
        return this._forestNoise;
    }
    public set forestNoise(value: number) {
        this._forestNoise = value;
    }
    private _deniveleNoise: number;
    public get deniveleNoise(): number {
        return this._deniveleNoise;
    }
    public set deniveleNoise(value: number) {
        this._deniveleNoise = value;
    }
    private _mapBuffer: Buffer;
    public get mapBuffer(): Buffer {
        return this._mapBuffer;
    }
    public set mapBuffer(value: Buffer) {
        this._mapBuffer = value;
    }

    constructor(){
    }

    async new(){
        var result = await MapGenerator.generateMap()
        Map.currentMap=this
        this.mapBuffer = result.canvas.toBuffer()
        this.montagneNoise = result.montagneSeed
        this.forestNoise = result.forestSeed
        this.deniveleNoise = result.deniveleSeed
        console.log(result)
        var thisChannel = Map.client.channels.cache.get("854016650750459915")
        if (thisChannel instanceof TextChannel){
            var messageSent = await thisChannel.send({files:[new MessageAttachment(this.mapBuffer)]})
            Map.currentMapUrl = messageSent.attachments.first().url
        }
    }

    async createFromCoords(pos:position,zoom,options?:{playerLocation:position,opponents?:Array<Player>,pointers?:Array<{icon:string,size:number,pos:position}>,showOpponentsNum?:boolean}){
        return await MapGenerator.generateMapFromCoords(pos.x,pos.y,zoom,this.deniveleNoise,this.forestNoise,this.montagneNoise,options)
    }

    static searchExistentMap(pos:position,zoom:number,player:Player):string{
        return Cache.mapFind(player,pos,zoom)
        
    }

    static async hostBuffer(b:Buffer,o?:{player:Player,pos:position,z:number}):Promise<string>{
        var thisChannel = this.client.channels.cache.get("854016650750459915")
        if (thisChannel instanceof TextChannel){
            var messageSent = await thisChannel.send({files:[new MessageAttachment(b)]})
            if (o){
                Cache.mapAdd(o.player,o.pos,o.z,messageSent.attachments.first().url)
            }
            return messageSent.attachments.first().url
        }else{
            return undefined
        }
    }
}