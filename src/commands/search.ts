import Cache from "../class/cache/Cache"
import Map from "../class/map/Map"
import Resource from "../class/resource/Resource"
import { resources, resourcesGroups, resourcesRarityChances } from "../static/resourceList"
import commandSender from "../types/commandSender"

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)
    if (!thisPlayer.hasCooldown("SEARCH")){
        var thisPlayerLocation = Map.currentMap.getLocationFromCoords(thisPlayer.getRealPosition())
        var resources = Resource.generateResourcesFromLocationType(thisPlayerLocation.type)
        for (var i in resources){
            var numberChoose = Math.floor(Math.random()*(resources[i].capacity.max-resources[i].capacity.min+1))+resources[i].capacity.min
            for (var j=0;j<numberChoose;j++){
                thisPlayer.addInResources(resources[i].resource)
            }
        }
    }
}