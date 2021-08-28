import { Client, Collection } from "discord.js";
import position from "../../types/position";
import Player from "../player/Player";
import PlayerCreator from "../player/PlayerCreator";

export default class Cache {
    static client:Client;
    static players: Collection<string, Player> = new Collection();
    static mapCards:Collection<string,string> = new Collection();

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

    static mapFind(p:Player,pos:position,z:number):string{
        if (this.mapCards.has(p.id+"-"+pos.x+"-"+pos.y+"-"+z)){
            return this.mapCards.get(p.id+"-"+pos.x+"-"+pos.y+"-"+z)
        }else{
            return undefined
        }
    }

    static mapAdd(p:Player,pos:position,z:number,s:string){
        this.mapCards.set(p.id+"-"+pos.x+"-"+pos.y+"-"+z,s)
    }
}