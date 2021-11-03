import Cache from "../class/cache/Cache"
import { weapons } from "../static/weaponList"
import commandSender from "../types/commandSender"
import CommandSenderManager from "../utility/CommandSenderManager"
import EmbedConstructor from "../utility/EmbedConstructor"

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)
    var weaponMessage = data.message?data.message.content.toLowerCase().split("b!info")[1].trim():""
    if (weapons.find(w=>w.name.fr==weaponMessage))
        CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.weaponInfo(weapons.find(w=>w.name.fr==weaponMessage))]})
    else
        CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.weaponInfoNotFound()]})
}