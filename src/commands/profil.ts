import PlayerCreator from "../class/player/PlayerCreator";
import commandSender from "../types/commandSender";
import EmbedConstructor from "../utility/EmbedConstructor";

export = async function(data:commandSender){
    const userId = data.message.author.id
    var thisPlayer = await PlayerCreator.fromId(userId)
    var embed = EmbedConstructor.playerProfil(thisPlayer)
    data.message.channel.send(embed)
}