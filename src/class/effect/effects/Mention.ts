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
            await player.lastChannel.send(EmbedConstructor.waitMention(this.toMention))
            var messageFound = await player.lastChannel.awaitMessages((m:Message)=>m.author.id == player.id,{"max":1})
            if (messageFound.first().mentions && messageFound.first().mentions.members && messageFound.first().mentions.members.first()){
                var result = await this.child.applyEffect(player,await Cache.playerFind( messageFound.first().mentions.members.first().id),[])
                if (result.success){
                    return {"success":true,data:{"message":result.data.message,"dead":result.data.dead}}
                }
            }else{

            }
        }else{
            var target = await Cache.playerFind(mentions[0]);
            mentions.splice(0,1)
            var result = await this.child.applyEffect(player,target,mentions)
            if (result.success){
                return {"success":true,data:{"message":result.data.message,"dead":result.data.dead,"mentionsUsed":1}}
            }
        }
    }
    
}