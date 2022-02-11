import Cache from "../cache/Cache";
import Database from "../database/Database";
import ClanPlayer from "../player/ClanPlayer";
import Player from "../player/Player";

export default class Clan {
    private _id: string;
    private _name: string;
    private _members:Array<Player>;

    constructor(data:databaseClan){
        this._id = data.id;
        this._name = data.name;
        this._members = [];
    }

    async getMembers(){
        if (this._members.length==0){
            var data = await Database.clanPlayerDatabase.find({"clan":this._id}).toArray()
            for (var i in data){
                console.log(data[i])
                this._members.push(await Cache.playerFind(data[i].id))
            }
        }
    }

    getMembersText():string{
        if (this._members.length==0){
            return "No members"
        }else{
            var text="";
            for (var i in this._members){
                text+=this._members[i].discordUser.tag+"\n"
            }
            return text
        }
    }

    async playerJoin(player:Player):Promise<boolean>{
        if (player.clanPlayer!=undefined){
            return false;
        }
        var toInsert = {"clan":this._id,"id":player.id,"role":"member"}
        await Database.clanPlayerDatabase.insertOne(toInsert)
        player.clanPlayer = new ClanPlayer(toInsert,this)
        this._members.push(player)
        return true;
    }

    async playerKick(player:Player,kicker?:Player):Promise<boolean>{
        if (kicker && (kicker.clanPlayer.role!="leader" && kicker.clanPlayer.role!="admin")){
            return false;
        }
        if (player.clanPlayer && player.clanPlayer.clan.id == this.id && this._members.find(p=>p.id==player.id)){
            await Database.clanPlayerDatabase.deleteOne({"id":player.id})
            player.clanPlayer = undefined;
            this._members.splice(this._members.findIndex(p=>p.id==player.id),1)
            return true;
        }else{
            return false;
        }
    }
    
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
}