import { Message } from "discord.js";
import damageType from "../../../types/effectConstructor/damageType";
import groupType from "../../../types/effectConstructor/groupType";
import mentionType from "../../../types/effectConstructor/mentionType";
import useEffect from "../../../types/useEffect";
import EmbedConstructor from "../../../utility/EmbedConstructor";
import Player from "../../player/Player";
import Effect from "../Effect";

export default class Group extends Effect{

    private children:Array<Effect>;

    constructor(data:groupType){
        super("Group","nearestMention")
        this.children = data.children
    }

    public toString(): string {
        return ""
    }

    public async applyEffect(player: Player, target:Player): Promise<useEffect> {
        var message = ""
        var isDead = false
        for (var i in this.children){
            var result = await this.children[i].applyEffect(player,target)
            if (result.success){
                message+=result.data.message+"\n"
                if (result.data.dead && !isDead) isDead=true
            }
        }
        return {"success":true,data:{"message":message,"dead":isDead}}
    }
    
}