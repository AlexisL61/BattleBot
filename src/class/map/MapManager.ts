import { Canvas } from "canvas"
import { Client, MessageAttachment, TextChannel } from "discord.js"
import MapGenerator from "./MapGenerator"


export default class MapManager {
    
    public static client:Client
    public static async generateNewMap():Promise<Buffer>{
        var thisCanvas:Canvas = await MapGenerator.generateMap()
        return thisCanvas.toBuffer()
    }

    public static async hostNewMap():Promise<string>{
        var thisCanvas:Buffer = await MapManager.generateNewMap()
        var thisChannel = this.client.channels.cache.get("854016650750459915")
        if (thisChannel instanceof TextChannel){
            var messageSent = await thisChannel.send(new MessageAttachment(thisCanvas))
            return messageSent.attachments.first().url
        }
        return null;
    }
}