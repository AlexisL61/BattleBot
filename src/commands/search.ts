import Cache from "../class/cache/Cache"
import commandSender from "../types/commandSender"

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)

}