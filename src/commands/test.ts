import { MessageAttachment } from "discord.js";
import MapManager from "../class/map/MapManager";
import commandSender from "../types/commandSender";

export= async function(data:commandSender){
    var date = Date.now()
    var buffer:Buffer = await MapManager.generateNewMap()
    var thisMessageAttachment:MessageAttachment = new MessageAttachment(buffer)

    data.message.channel.send("Generated in "+(Date.now() - date)+"ms",thisMessageAttachment)
}