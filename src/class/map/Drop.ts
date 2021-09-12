import { boxes } from "../../static/boxList"
import  drop  from "../../types/database/drop"
import position from "../../types/position"
import Cache from "../cache/Cache"
import Database from "../database/Database"
import Player from "../player/Player"

export default class Drop {
    private _timeAvailable: number
    public get timeAvailable(): number {
        return this._timeAvailable
    }
    public set timeAvailable(value: number) {
        this._timeAvailable = value
    }
    private _position: position
    public get position(): position {
        return this._position
    }
    public set position(value: position) {
        this._position = value
    }
    private _server: string
    public get server(): string {
        return this._server
    }
    public set server(value: string) {
        this._server = value
    }
    private _owner: {
        type: "PLAYER" | "SERVER"
        player?: string
    }
    public get owner(): {
        type: "PLAYER" | "SERVER"
        player?: string
    } {
        return this._owner
    }
    public set owner(value: {
        type: "PLAYER" | "SERVER"
        player?: string
    }) {
        this._owner = value
    }
    private _content: Array<{
        type: "box"
        id: string
    }>
    public get content(): Array<{
        type: "box"
        id: string
    }> {
        return this._content
    }
    public set content(value: Array<{
        type: "box"
        id: string
    }>) {
        this._content = value
    }
    private _database_id: string
    public get database_id(): string {
        return this._database_id
    }
    public set database_id(value: string) {
        this._database_id = value
    }

    constructor(data:{timeAvailable:number,position:position,server:string,content:Array<{type: "box",id: string}>,owner:{type:"PLAYER"|"SERVER",player?:string}}){
        this.timeAvailable = data.timeAvailable
        this.position = data.position
        this.server = data.server
        this.content = data.content
        this.owner = data.owner
    }

    public static async getDatabaseDrop(id:string):Promise<Drop>{
        var found:drop = await Database.dropDatabase.findOne({id:id})
        if (found){
            var thisDrop = new Drop({timeAvailable:found.timeAvailable,position:found.position,server:found.server,content:found.content,owner:found.owner})
            thisDrop._database_id = found.id
            return thisDrop
        }
        return undefined
    }

    public async open(p:Player){
        if (this.timeAvailable<Date.now()){
            Cache.removeDrop(this._database_id)
            await Database.dropDatabase.deleteOne({id:this.database_id})
            for (var i in this.content){
                if (this.content[i].type=="box"){
                    await p.addInBox(this.content[i].id)
                }
            }
        }
    }

    public async addInDatabase(){
        var id = Date.now().toString()
        this._database_id = id
        Cache.drops.set(id,this)
        await Database.dropDatabase.insertOne({"id":id,timeAvailable:this.timeAvailable,position:this.position,server:this.server,owner:this.owner,content:this.content})
    }

    public getContentString():string{
        var contentString = ""
        for (var i in this.content){
            if (this.content[i].type=="box"){
                console.log(this.content[i])
                var thisBox = boxes.find(b=>b.id==this.content[i].id)
                contentString+= thisBox.emoji+" "+thisBox.name.fr+"\n"
            }
        }
        return contentString
    }

    public static getServerDrops(id:string):Array<Drop>{
        /*var found:Array<drop> = await Database.dropDatabase.find({server:id}).toArray()
        var allDrops = []
        for (var i in found){
            var thisDrop:Drop = new Drop({timeAvailable:found[i].timeAvailable,position:found[i].position,server:found[i].server,content:found[i].content,owner:found[i].owner})
            thisDrop._database_id = found[i].id
            allDrops.push(thisDrop)
        }
        return allDrops*/
        return Cache.drops.filter(d=>d.server==id).toJSON()
    }
}