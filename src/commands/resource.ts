import Cache from "../class/cache/Cache"
import commandSender from "../types/commandSender"
import CommandSenderManager from "../utility/CommandSenderManager"
import EmbedConstructor from "../utility/EmbedConstructor"

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)
    CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.playerResources(thisPlayer)]})
}