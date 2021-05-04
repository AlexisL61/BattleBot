import { MessageMentions, TextChannel } from "discord.js";
import mention from "../../types/mentions";
import useWeapon from "../../types/useWeapon";
import Effect from "../effect/Effect";
import Player from "../player/Player";
import PlayerCreator from "../player/PlayerCreator";

export default abstract class Weapon {
    private id:string;
    private name:{"fr":string,"en":string};
    private emoji:string;
    private image:string;
    private mentions:Array<mention> = []
    private effects:Array<Effect> = []

    constructor(){

    }

    public async use(player:Player, message:String):Promise<useWeapon>{
        var userArray = message.match(MessageMentions.USERS_PATTERN) || [];
        if (userArray.length == this.mentions.filter(m=>m.type=="user").length){
            var finalMessage = ""
            for (var i in this.mentions){
                var effectToAdd = this.effects.filter(e=>e.mentionTarget==this.mentions[i].id)
                var thisUser = await PlayerCreator.fromId(userArray[i].replace("<@","").replace("!","").replace(">",""))
                for (var j in effectToAdd){
                    finalMessage += (await effectToAdd[j].applyEffect(thisUser)).data.message
                }
            }
            return {"success":true,"data":{"message":finalMessage}}
        }else{
            return {"success":false,"data":{"message":""}}
        }
    }
}