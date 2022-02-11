import { ButtonInteraction, GuildMember } from "discord.js"
import Cache from "../../class/cache/Cache"
import ClanCreator from "../../class/clan/ClanCreator"
import commandSender from "../../types/commandSender"
import CommandSenderManager from "../../utility/CommandSenderManager"
import ComponentsConstructor from "../../utility/ComponentsConstructor"
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
    var memberToInvite = data.interaction.options.getMember("utilisateur")
    if (memberToInvite instanceof GuildMember){
        var playerToInvite = await Cache.playerFind(memberToInvite.id)
        if (playerToInvite==undefined){
            return CommandSenderManager.reply(data,{embeds:[EmbedConstructor.notRegisterEmbed("OTHER")]})
        }
        if (playerToInvite.clanPlayer!=undefined){
            return CommandSenderManager.reply(data,{embeds:[EmbedConstructor.playerAlreadyInClan()]})
        }
        var clanToInvite = thisPlayer.clanPlayer.clan
        var messageSent = await playerToInvite.discordUser.send({embeds:[EmbedConstructor.clanInvitation(thisPlayer)],components:ComponentsConstructor.clanInvitationComponent()})
        CommandSenderManager.reply(data,{embeds:[EmbedConstructor.clanInvitationSent()]})
        var componentClicked = messageSent.awaitMessageComponent({"filter":mc=>mc.user.id==playerToInvite.id,"componentType":"BUTTON"})
        if (componentClicked instanceof ButtonInteraction && componentClicked.customId=="join"){
            var success = clanToInvite.playerJoin(playerToInvite)
            if (success){
                messageSent.channel.send({embeds:[EmbedConstructor.clanInvitationAcceptedSuccess()]})
            }else{
                messageSent.channel.send({embeds:[EmbedConstructor.clanInvitationAcceptedFail()]})
            }
        }
    }
}