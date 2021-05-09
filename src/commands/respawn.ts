import Cache from "../class/cache/Cache";
import PlayerCreator from "../class/player/PlayerCreator";
import commandSender from "../types/commandSender";
import EmbedConstructor from "../utility/EmbedConstructor";

export = async function(data:commandSender){
    const userId = data.message.author.id
    var thisPlayer = await Cache.playerFind(userId)
    if (thisPlayer.data.dead){
        thisPlayer.data.lifeStats.health = 100
        thisPlayer.data.dead = false
        await thisPlayer.save()
        data.message.channel.send(EmbedConstructor.respawnSuccess())
    }else{
        data.message.channel.send(EmbedConstructor.respawnFailed())
    }
}