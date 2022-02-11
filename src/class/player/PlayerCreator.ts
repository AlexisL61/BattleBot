import { Client } from "discord.js";
import databasePlayer, { databaseClanPlayer, _playerDefault } from "../../types/database/player";
import Clan from "../clan/Clan";
import Database from "../database/Database";
import ClanPlayer from "./ClanPlayer";
import Player from "./Player";

export default class PlayerCreator {
    static client:Client

    public static async fromId(id:string):Promise<Player>{
        console.log(id)
        var fetchData = undefined;
        try {
            fetchData = await this.client.users.fetch(id)
        }catch(e){}
        if (fetchData!=undefined){
            var databaseData = await this.getDatabaseUserFromId(id)
            if (databaseData!=undefined){
                const player = new Player(fetchData,databaseData)
                await player.loadAll()
                return player
            }
        }
        return undefined;
    }

    private static async getDatabaseUserFromId(id:string):Promise<databasePlayer>{
        var result = await Database.playerDatabase.findOne({"id":id})
        return result
    }
}