import { Message } from "discord.js";
import damageType from "../../../types/effectConstructor/damageType";
import mentionType from "../../../types/effectConstructor/mentionType";
import useEffect from "../../../types/useEffect";
import EmbedConstructor from "../../../utility/EmbedConstructor";
import Cache from "../../cache/Cache";
import Player from "../../player/Player";
import Effect from "../Effect";

export default class Mention extends Effect{

    private child:Effect;
    private toMention:string;

    constructor(data:mentionType){
        super("Mention","nearestMention")
        this.child = data.child
        this.toMention = data.toMention
    }

    public toString(): string {
        return ""
    }

    public async applyEffect(player: Player, target:Player,mentions:Array<string>): Promise<useEffect> {
        if (mentions.length==0){
            await player.lastChannel.send({embeds:[await EmbedConstructor.waitMention(this.toMention,player,player.lastChannel.guild)]})
            var messageFound = await player.lastChannel.awaitMessages({filter:(m:Message)=>m.author.id == player.id,"max":1})
            if (parseInt(messageFound.first().content)){
                mentions.push((await player.getAttackablePlayers(player.lastChannel.guild))[parseInt(messageFound.first().content)-1].discordUser.id)
            }else{
                return {"success":false}
            }
        }
            var target = await Cache.playerFind(mentions[0]);
            mentions.splice(0,1)
            if (player.isAttackable().result==false) return {"success":false,data:{"message":"Ce joueur a un bouclier, il n'est pas attaquable"}}
            if (player.getDistance(target.getRealPosition())>Player.visibilityRadius) return {"success":false}
            var result = await this.child.applyEffect(player,target,mentions)
            if (result.success){
                return {"success":true,data:{"message":result.data.message,"dead":result.data.dead,"mentionsUsed":1}}
            }
    }
    
}