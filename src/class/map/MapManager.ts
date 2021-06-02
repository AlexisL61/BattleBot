import { Canvas } from "canvas"
import { Client } from "discord.js"
import MapGenerator from "./MapGenerator"

export default class MapManager {
    
    public static client:Client
    public static async generateNewMap():Promise<Buffer>{
        var thisCanvas:Canvas = await MapGenerator.generateMap()
        return thisCanvas.toBuffer()
    }
}