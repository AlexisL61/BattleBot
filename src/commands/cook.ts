import { ButtonInteraction, MessageComponentInteraction, SelectMenuInteraction } from "discord.js"
import Cache from "../class/cache/Cache"
import CookedFood from "../class/resource/CookedFood"
import Resource from "../class/resource/Resource"
import commandSender from "../types/commandSender"
import CommandSenderManager from "../utility/CommandSenderManager"
import ComponentsConstructor from "../utility/ComponentsConstructor"
import EmbedConstructor from "../utility/EmbedConstructor"

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)
    var startCooking = false
    var messageSent = await CommandSenderManager.reply(data,"Chargement...")
    var selected:Array<Resource> = []
    var available:Array<Resource> = thisPlayer.resources.filter(r=>true)
    console.log(available)
    var cancel = false
    while (!startCooking){
        await messageSent.edit({"embeds":[EmbedConstructor.playerResourcesToCook(selected,available)],"components":ComponentsConstructor.playerResourcesSelectComponent(available,selected.length)})
        var interactionSelected:MessageComponentInteraction = await messageSent.awaitMessageComponent({"filter":mc=>mc.user.id==thisPlayer.id})
        if (interactionSelected instanceof SelectMenuInteraction){
            var value = interactionSelected.values[0]
            selected.push(available.splice(available.findIndex(r=>r.databaseId==value),1)[0])
            interactionSelected.deferUpdate()
        }else{
            if (interactionSelected instanceof ButtonInteraction){
                if (interactionSelected.customId=="cancel"){
                    cancel = true
                    break
                }else{
                    break
                }
            }
        }
    }
    if (cancel){
        messageSent.channel.send({"embeds":[EmbedConstructor.cookCancel()]})
        messageSent.delete()
    }else{
        var finalMessageSent=await messageSent.channel.send({"embeds":[EmbedConstructor.currentlyCooking()]})
        messageSent.delete()
        finalMessageSent.edit({"embeds":[EmbedConstructor.currentlyCooking()]})
        var cookedFood = await CookedFood.createFromResources(thisPlayer,selected)
        finalMessageSent.edit({"embeds":[EmbedConstructor.cookingEnded(cookedFood)]})
    }
}