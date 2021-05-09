import Cache from "../class/cache/Cache";
import PlayerCreator from "../class/player/PlayerCreator";
import commandSender from "../types/commandSender";
import EmbedConstructor from "../utility/EmbedConstructor";

export = async function(data:commandSender){
    const userId = data.message.author.id
    var thisPlayer = await Cache.playerFind(userId)
    var embed = EmbedConstructor.playerProfil(thisPlayer)
    data.message.channel.send(embed)
}