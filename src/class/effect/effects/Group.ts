import { Message } from "discord.js";
import damageType from "../../../types/effectConstructor/damageType";
import groupType from "../../../types/effectConstructor/groupType";
import mentionType from "../../../types/effectConstructor/mentionType";
import useEffect, { useEffectPlayersTargeted } from "../../../types/useEffect";
import EmbedConstructor from "../../../utility/EmbedConstructor";
import Cache from "../../cache/Cache";
import Player from "../../player/Player";
import Effect from "../Effect";

export default class Group extends Effect{

    private children:Array<Effect>;
    private groupTarget:"SAME_TARGET"|"DIFFERENT_TARGET"

    constructor(data:groupType){
        super("Group","nearestMention")
        this.children = data.children
        this.groupTarget = data.groupTarget
    }

    public toString(): string {
        return ""
    }

    public async applyEffect(player: Player, target:Player,mentions:Array<string>): Promise<useEffect> {
        var message = ""
        var isDead = false
        var playersTargeted:Array<useEffectPlayersTargeted> = []
        for (var i in this.children){
            var result = await this.children[i].applyEffect(player,target,mentions)
            if (result.success){
                for (var j in result.data.playersTargeted){
                    playersTargeted.push(result.data.playersTargeted[j])
                }
                message+=result.data.message+"\n"
            }
            if (this.groupTarget=="DIFFERENT_TARGET" && parseInt(i)+1!=this.children.length){
                target = await Cache.playerFind(mentions[0])
                mentions.splice(0,1)
            }
        }
        return {"success":true,data:{"message":message,playersTargeted:playersTargeted}}
    }
    
}