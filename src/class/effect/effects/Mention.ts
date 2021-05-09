import { Message } from "discord.js";
import damageType from "../../../types/effectConstructor/damageType";
import mentionType from "../../../types/effectConstructor/mentionType";
import useEffect from "../../../types/useEffect";
import EmbedConstructor from "../../../utility/EmbedConstructor";
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

    public async applyEffect(player: Player, target:Player): Promise<useEffect> {
        await player.lastChannel.send(EmbedConstructor.waitMention(this.toMention))
        var messageFound = await player.lastChannel.awaitMessages((m:Message)=>m.author.id == player.id,{"max":1})
        if (messageFound.first().mentions && messageFound.first().mentions.members && messageFound.first().mentions.members.first){
            var result = await this.child.applyEffect(player,target)
            if (result.success){
                return {"success":true,data:{"message":result.data.message,"dead":result.data.dead}}
            }
        }else{

        }
    }
    
}