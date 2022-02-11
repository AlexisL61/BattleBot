import playerEffect from "../../types/database/playerEffect";
import Database from "../database/Database";
import Player from "./Player";

export default class PlayerEffect {
    private _effect_type: "SPEED"|"FIRE";
    private _power: number;
    private _start_time: number;
    private _end_time: number;
    private _variable_start_time: number;
    private _variable_end_time: number;
    private _databaseId: string;
    private _owner: string;


    constructor(playerEffect?:playerEffect) {
        if (playerEffect){
            this.effect_type = playerEffect.effect_type;
            this.power = playerEffect.power;
            this.start_time = playerEffect.start_time;
            this.end_time = playerEffect.end_time;
        }
    }

    public static async getDatabaseEffect(effectId:string): Promise<PlayerEffect> {
        var found:playerEffect =await Database.resourceDatabase.findOne({"id":effectId})
        if (found){
            var c = new PlayerEffect(found);
            c._owner = found.owner
            c._databaseId = found.id
            return c
        }else{
            return undefined
        }
    }

    public static async createFromResource(resourceEffect:resourceEffect,player:Player){
        
        var thisEffectsAvailable = player.effects.filter(e=>e.end_time>Date.now() && e.effect_type==resourceEffect.effect_type && e.power==resourceEffect.power)
        var startTime = Date.now()
        if (thisEffectsAvailable.length>=1){    
            startTime = thisEffectsAvailable[thisEffectsAvailable.length-1].end_time
            thisEffectsAvailable[thisEffectsAvailable.length-1].end_time += resourceEffect.duration*1000
            await Database.playerEffectDatabase.updateOne({id:thisEffectsAvailable[thisEffectsAvailable.length-1].databaseId},{$set:{end_time:thisEffectsAvailable[thisEffectsAvailable.length-1].end_time}})
        }else{
            var databaseEffect:playerEffect = {
                "id":Date.now().toString(),
                "effect_type":resourceEffect.effect_type,
                "power":resourceEffect.power,
                "start_time":startTime,
                "end_time":startTime+resourceEffect.duration*1000,
                "owner":player.id
            }
            var e = new PlayerEffect(databaseEffect);
            e._owner = databaseEffect.owner
            e._databaseId = databaseEffect.id
            player.addEffect(e)
            
            await Database.playerEffectDatabase.insertOne(databaseEffect)
        }
        return e
    }

    
    public get effect_type(): "SPEED"|"FIRE" {
        return this._effect_type;
    }
    public set effect_type(value: "SPEED"|"FIRE") {
        this._effect_type = value;
    }
    
    public get power(): number {
        return this._power;
    }
    public set power(value: number) {
        this._power = value;
    }
    
    public get start_time(): number {
        return this._start_time;
    }
    public set start_time(value: number) {
        this._start_time = value;
    }
    
    public get end_time(): number {
        return this._end_time;
    }
    public set end_time(value: number) {
        this._end_time = value;
    }
    
    public get databaseId(): string {
        return this._databaseId;
    }
    public set databaseId(value: string) {
        this._databaseId = value;
    }
    
    public get owner(): string {
        return this._owner;
    }
    public set owner(value: string) {
        this._owner = value;
    }

    
    public get variable_start_time(): number {
        return this._variable_start_time;
    }
    public set variable_start_time(value: number) {
        this._variable_start_time = value;
    }
    
    public get variable_end_time(): number {
        return this._variable_end_time;
    }
    public set variable_end_time(value: number) {
        this._variable_end_time = value;
    }
}