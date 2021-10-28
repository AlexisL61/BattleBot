import { Canvas } from "canvas";
import { Client, Collection } from "discord.js";
import { fstat, writeFileSync } from "fs";
import drop from "../../types/database/drop";
import position from "../../types/position";
import Database from "../database/Database";
import Drop from "../map/Drop";
import Player from "../player/Player";
import PlayerCreator from "../player/PlayerCreator";

export default class Cache {
    static client:Client;
    static players: Collection<string, Player> = new Collection();
    static mapCards:Collection<string,string> = new Collection();
    static drops:Collection<string,Drop> = new Collection();

    /**
     * Récupère le joueur dans le cache, créé un nouveau joueur sinon
     * @param id Id du joueur
     * @returns Le joueur
     */
    static async playerFind(id:string):Promise<Player>{
        if (this.players.has(id)){
            return this.players.get(id)
        }else{
            const thisPlayer = await PlayerCreator.fromId(id)
            if (thisPlayer!=undefined) this.addPlayer(thisPlayer)
            return thisPlayer
        }
    }

    /**
     * Ajoute le joueur au cache
     * @param player Joueur
     * @returns true si l'utilisateur existait déjà dans le cache, false sinon
     */
    static addPlayer(player:Player):boolean{
        if (!this.players.has(player.id)){
            this.players.set(player.id,player)
            return true
        }else{
            return false
        }
    }

    static mapFind(pos:position,z:number):string{
        if (this.mapCards.has(pos.x+"-"+pos.y+"-"+z)){
            return this.mapCards.get(pos.x+"-"+pos.y+"-"+z)
        }else{
            return undefined
        }
    }

    static mapAdd(pos:position,z:number,s:Buffer){
        var date = Date.now()
        writeFileSync(__dirname+"/../../static/map_images/"+date,s)
        this.mapCards.set(pos.x+"-"+pos.y+"-"+z,date+"")
    }

    static async dropFind(id:string):Promise<Drop>{
        if (!this.drops.has(id)){
            var thisDrop = await Drop.getDatabaseDrop(id)
            if (!thisDrop) return undefined
            this.drops.set(id,thisDrop)
        }
        return this.drops.get(id)
    }

    static async removeDrop(id:string){
        this.drops.delete(id)
    }

    static async init(){
        var foundDrops:Array<drop> = await Database.dropDatabase.find().toArray()
        for (var i in foundDrops){
            var thisDrop = new Drop({timeAvailable:foundDrops[i].timeAvailable,position:foundDrops[i].position,content:foundDrops[i].content,server:foundDrops[i].server,owner:foundDrops[i].owner})
            thisDrop.database_id = foundDrops[i].id
            this.drops.set(foundDrops[i].id,thisDrop)
        }
    }
}