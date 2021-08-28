import { MessageAttachment } from "discord.js";
import Map from "../class/map/Map";
import commandSender from "../types/commandSender";
import position from "../types/position";

export= async function(data:commandSender){
    var date = Date.now()
    const currentMap = new Map()
    await currentMap.new() 
    var thisMessageAttachment:MessageAttachment = new MessageAttachment(currentMap.mapBuffer)

    data.message.channel.send({content:"Generated in "+(Date.now() - date)+"ms",files:[thisMessageAttachment]})
    var playerCoords:position = {x:100,y:100}
    var buffer = await currentMap.createFromCoords(playerCoords,5)
    thisMessageAttachment = new MessageAttachment(buffer)

    data.message.channel.send({content:"Generated in "+(Date.now() - date)+"ms",files:[thisMessageAttachment]})
}