import { GuildMember } from "discord.js";
import Cache from "../class/cache/Cache";
import PlayerCreator from "../class/player/PlayerCreator";
import commandSender from "../types/commandSender";
import CommandSenderManager from "../utility/CommandSenderManager";
import EmbedConstructor from "../utility/EmbedConstructor";

export = async function(data:commandSender){
    var userId = data.type=="MESSAGE"?data.message.author.id:data.interaction.user.id
    if (data.type=="INTERACTION" && data.interaction.options.get("membre")){
        userId = data.interaction.options.getMember("membre") instanceof GuildMember?data.interaction.options.get("membre",false).value.toString():userId
    }
    var thisPlayer = await Cache.playerFind(userId)
    if (!thisPlayer){
        return CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.notRegisterEmbed("OTHER")]})
    }
    var embed = EmbedConstructor.playerProfil(thisPlayer)
    CommandSenderManager.reply(data,{embeds:[embed]})
}