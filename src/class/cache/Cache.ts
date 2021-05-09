import { Client, Collection } from "discord.js";
import Player from "../player/Player";
import PlayerCreator from "../player/PlayerCreator";

export default class Cache {
    static client:Client;
    static players: Collection<string, Player> = new Collection();

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
            this.addPlayer(thisPlayer)
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
}