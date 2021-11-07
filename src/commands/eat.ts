import { SelectMenuInteraction } from "discord.js"
import Cache from "../class/cache/Cache"
import PlayerEffect from "../class/player/PlayerEffect"
import { resources } from "../static/resourceList"
import commandSender from "../types/commandSender"
import CommandSenderManager from "../utility/CommandSenderManager"
import ComponentsConstructor from "../utility/ComponentsConstructor"
import EmbedConstructor from "../utility/EmbedConstructor"

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)
    if (thisPlayer.cookedFoods.length>0){
        var messageSent = await CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.selectFoodToEat(thisPlayer)],"components":ComponentsConstructor.selectFoodToEat(thisPlayer)})
    
        var component = await messageSent.awaitMessageComponent({"componentType":"SELECT_MENU"})
        if (component instanceof SelectMenuInteraction){
            var value = component.values[0]
            var currentCookedFoodIndex = thisPlayer.cookedFoods.findIndex(c=>c.databaseId==value)
            var currentCookedFood = thisPlayer.cookedFoods[currentCookedFoodIndex]
            await thisPlayer.addLifePoint({health:currentCookedFood.getHealth(),shield:currentCookedFood.getShield()})
            for (var i in currentCookedFood.bonus.effects){
                var effect = currentCookedFood.bonus.effects[i]
                PlayerEffect.createFromResource(currentCookedFood.bonus.effects[i],thisPlayer)
            }
            await thisPlayer.removeInCookedFood(currentCookedFoodIndex)
            await messageSent.channel.send({embeds:[EmbedConstructor.cookedFoodEaten(currentCookedFood)]})
            messageSent.delete()
        }
    }else{
        await CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.noFoodToEat()]})
    }
}