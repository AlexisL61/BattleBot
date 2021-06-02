import { Client } from "discord.js";
import databasePlayer, { _playerDefault } from "../../types/database/player";
import Database from "../database/Database";
import Player from "./Player";

export default class PlayerCreator {
    static client:Client

    public static async fromId(id:string):Promise<Player>{
        var fetchData = await this.client.users.fetch(id)
        if (fetchData!=undefined){
            const player = new Player(fetchData,await this.getDatabaseUserFromId(id))
            await player.loadInventory()
            await player.loadBoxes()
            return player
        }
        return undefined;
    }

    private static async getDatabaseUserFromId(id:string):Promise<databasePlayer>{
        var result = await Database.playerDatabase.findOne({"id":id})
        if (result!=undefined){
            return result
        }else{
            const returnData = _playerDefault
            returnData.id = id
            return returnData
        }
    }
}