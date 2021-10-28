import Cache from "../class/cache/Cache"
import Map from "../class/map/Map"
import Resource from "../class/resource/Resource"
import { resources, resourcesGroups, resourcesRarityChances } from "../static/resourceList"
import commandSender from "../types/commandSender"
import CommandSenderManager from "../utility/CommandSenderManager"
import EmbedConstructor from "../utility/EmbedConstructor"

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)
    console.log(thisPlayer.cooldowns)
    if (!thisPlayer.hasCooldown("SEARCH").result){
        var thisPlayerLocation = Map.currentMap.getLocationFromCoords(thisPlayer.getRealPosition())
        var resources = Resource.generateResourcesFromLocationType(thisPlayerLocation.type)
        var resourcesGotten = ""
        for (var i in resources){
            var numberChoose = Math.floor(Math.random()*(resources[i].capacity.max-resources[i].capacity.min+1))+resources[i].capacity.min
            for (var j=0;j<numberChoose;j++){
                thisPlayer.addInResources(resources[i].resource)
            }
            var resourceCreated = new Resource(resources[i].resource)
            resourcesGotten+= resourceCreated.emoji+" "+ resourceCreated.name.fr+" de qualité "+resourceCreated.rarity.emoji+" "+resourceCreated.rarity.name.fr+" x"+numberChoose+"\n"
        }
        await thisPlayer.addCooldown("SEARCH",60*60)
        CommandSenderManager.reply(data,{embeds:[EmbedConstructor.searchDone(resourcesGotten)]})
    }else{
        CommandSenderManager.reply(data,{embeds:[EmbedConstructor.searchOnCooldown(resourcesGotten)]})
    }
}