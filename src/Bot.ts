import Discord, { MessageMentions } from "discord.js"
import Cache from "./class/cache/Cache";
import Database from "./class/database/Database";
import MapManager from "./class/map/MapManager";
import Player from "./class/player/Player";
import PlayerCreator from "./class/player/PlayerCreator";

import commandFile, { totalCommands } from "./types/commandFile";
import commandSender from "./types/commandSender";
import EmbedConstructor from "./utility/EmbedConstructor";
require("dotenv").config()

var commands:Array<commandFile> = totalCommands

const client = new Discord.Client()
const prefix = "b!"

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:"+process.env.mongodbpass+"@cluster0.riplg.mongodb.net/?retryWrites=true&w=majority";
const mclient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mclient.connect(err => {
    client.login(process.env.discordtoken)
})

client.on("ready",()=>{
    console.log("ready")
    var playerDatabase = mclient.db("Player").collection("Player")
    Database.playerDatabase = playerDatabase
    Database.attackDatabase = mclient.db("Player").collection("Attack")
    Database.inventoryDatabase = mclient.db("Player").collection("Inventory")
    Database.boxDatabase = mclient.db("Player").collection("Box")
    PlayerCreator.client = client
    MapManager.client = client
})

client.on("message",async (message)=>{
    
    //console.log(message.content.match(MessageMentions.USERS_PATTERN))
    if (commands.find(c=>message.content.replace(prefix,"").startsWith(c.command))){
        var commandFound:commandFile = commands.find(c=>message.content.replace(prefix,"").startsWith(c.command))
        if (commandFound.needAlive){
            var player = await Cache.playerFind(message.author.id)
            if (player.data.dead){
                return message.channel.send(EmbedConstructor.needRespawn())
            }
        }
        const start = require("./commands/"+commandFound.file)
        
        start({"message":message})
    }
})
