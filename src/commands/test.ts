import { MessageAttachment } from "discord.js";
import Cache from "../class/cache/Cache";
import Map from "../class/map/Map";
import commandSender from "../types/commandSender";
import position from "../types/position";

export= async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)
    thisPlayer.loadAll()
}