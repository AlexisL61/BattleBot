import { databaseClanPlayer } from "../../types/database/player"
import Database from "../database/Database"
import ClanPlayer from "../player/ClanPlayer"
import Player from "../player/Player"
import Clan from "./Clan"

export default class ClanCreator {
    public static async fromId(id:string):Promise<Clan>{
        var databaseData = await this.getDatabaseClanFromId(id)
        if (databaseData!=undefined){
            const clan = new Clan(databaseData)
            return clan
        }
        return undefined;
    }

    private static async getDatabaseClanFromId(id:string):Promise<databaseClan>{
        var result = await Database.clanDatabase.findOne({"id":id})
        return result
    }

    public static async create(player:Player,name:string):Promise<boolean>{
        if (player.clanPlayer==undefined){
            var newClan:databaseClan = {
                "id":Date.now().toString(),
                "name":name
            }
            await Database.clanDatabase.insertOne(newClan)
            var newPlayerClan:databaseClanPlayer = {
                "id":player.id,
                "clan":newClan.id,
                "role":"leader"
            }
            await Database.clanPlayerDatabase.insertOne(newPlayerClan)
            await player.loadClan([newPlayerClan])
            return true;
        }else{
            return false;
        }
    }
}