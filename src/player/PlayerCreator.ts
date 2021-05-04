import { Client } from "discord.js";
import databasePlayer, { _playerDefault } from "../types/database/player";
import Player from "./Player";

export default class PlayerCreator {
    
    static playerDatabase:any;
    static client:Client

    public static async fromId(id:string):Promise<Player>{
        var fetchData = await this.client.users.fetch(id)
        if (fetchData!=undefined){
            return new Player(fetchData,await this.getDatabaseUserFromId(id))
        }
    }

    private static async getDatabaseUserFromId(id:string):Promise<databasePlayer>{
        var result = await this.playerDatabase.findOne({"id":id})
        if (result!=undefined){
            return result
        }else{
            const returnData = _playerDefault
            returnData.id = id
            return returnData
        }
    }
}