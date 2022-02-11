import { GuildMember } from "discord.js"
import Cache from "../../class/cache/Cache"
import commandSender from "../../types/commandSender"
import CommandSenderManager from "../../utility/CommandSenderManager"
import EmbedConstructor from "../../utility/EmbedConstructor"

export = async function(data:commandSender){
    console.log("Invite")
    var userId = data.type=="MESSAGE"?data.message.author.id:data.interaction.user.id
    if (data.type=="INTERACTION" && data.interaction.options.get("membre")){
        userId = data.interaction.options.getMember("membre") instanceof GuildMember?data.interaction.options.get("membre",false).value.toString():userId
    }
    var thisPlayer = await Cache.playerFind(userId)
    if (!thisPlayer){
        return CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.notRegisterEmbed("OTHER")]})
    }
    if (thisPlayer.clanPlayer==undefined){
        return CommandSenderManager.reply(data,{embeds:[EmbedConstructor.playerNotInClanWithoutCreation()]})
    }
    var memberToKick = data.interaction.options.getMember("utilisateur")
    if (memberToKick instanceof GuildMember){
        var playerToKick = await Cache.playerFind(memberToKick.id)
        if (playerToKick.id == thisPlayer.id){
            return CommandSenderManager.reply(data,{embeds:[EmbedConstructor.clanCantKickYourself()]})
        }
        if (thisPlayer.clanPlayer.clan.id != playerToKick.clanPlayer.clan.id) {
            return CommandSenderManager.reply(data,{embeds:[EmbedConstructor.playerNotInSameClan()]})
        }
        if (thisPlayer.clanPlayer.role!="leader" && thisPlayer.clanPlayer.role!="admin"){
            return CommandSenderManager.reply(data,{embeds:[EmbedConstructor.clanKickNotAuthorized()]})
        }
        var success = await thisPlayer.clanPlayer.clan.playerKick(playerToKick,thisPlayer)
        if (success){
            return CommandSenderManager.reply(data,{embeds:[EmbedConstructor.clanKickSuccess()]})
        }else{
            return CommandSenderManager.reply(data,{embeds:[EmbedConstructor.clanKickFail()]})
        }
    }
}