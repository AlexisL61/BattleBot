import { ButtonInteraction, GuildMember } from "discord.js"
import Cache from "../../class/cache/Cache"
import ClanCreator from "../../class/clan/ClanCreator"
import commandSender from "../../types/commandSender"
import CommandSenderManager from "../../utility/CommandSenderManager"
import ComponentsConstructor from "../../utility/ComponentsConstructor"
import EmbedConstructor from "../../utility/EmbedConstructor"

export = async function(data:commandSender){
    var userId = data.type=="MESSAGE"?data.message.author.id:data.interaction.user.id
    if (data.type=="INTERACTION" && data.interaction.options.get("membre")){
        userId = data.interaction.options.getMember("membre") instanceof GuildMember?data.interaction.options.get("membre",false).value.toString():userId
    }
    var thisPlayer = await Cache.playerFind(userId)
    if (!thisPlayer){
        return CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.notRegisterEmbed("OTHER")]})
    }
    if (thisPlayer.clanPlayer!=undefined){
        await thisPlayer.clanPlayer.clan.getMembers()
        var embed = EmbedConstructor.playerClan(thisPlayer)
        CommandSenderManager.reply(data,{embeds:[embed]})

    }else{
        var messageSent = await CommandSenderManager.reply(data,{embeds:[EmbedConstructor.playerNotInClan()],components:ComponentsConstructor.notInClanComponent()})
        var interactionSelected = await messageSent.awaitMessageComponent({"filter":mc=>mc.user.id==thisPlayer.id})
        if (interactionSelected instanceof ButtonInteraction){
            if (interactionSelected.customId=="create"){
                var newMessageSent =await messageSent.channel.send({embeds:[EmbedConstructor.clanCreationAskName()]})
                await messageSent.delete()
                var dataReceived = await newMessageSent.channel.awaitMessages({filter:m=>m.author.id==thisPlayer.id,max:1})
                if (dataReceived){
                    var name = dataReceived.first().content
                    var newClan = await ClanCreator.create(thisPlayer,name)
                    if (newClan){
                        newMessageSent.edit({embeds:[EmbedConstructor.clanCreated(name)]})
                    }else{
                        newMessageSent.edit({embeds:[EmbedConstructor.clanCreationFailed()]})
                    }
                }
            }
        }
    }
    
}