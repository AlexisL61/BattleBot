import Discord, { Intents, Message, MessageMentions, TextChannel, ThreadChannel } from "discord.js"
import Cache from "./class/cache/Cache";
import Database from "./class/database/Database";
import Map from "./class/map/Map";
import Player from "./class/player/Player";
import PlayerCreator from "./class/player/PlayerCreator";

import commandFile, { totalCommands } from "./types/commandFile";
import commandSender from "./types/commandSender";
import EmbedConstructor from "./utility/EmbedConstructor";
require("dotenv").config()

var commands:Array<commandFile> = totalCommands

const client = new Discord.Client({intents:[Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.DIRECT_MESSAGE_TYPING,Intents.FLAGS.GUILDS]})  
const prefix = "b!"

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:"+process.env.mongodbpass+"@cluster0.riplg.mongodb.net/?retryWrites=true&w=majority";
const mclient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mclient.connect(err => {
    client.login(process.env.discordtoken)
})

client.on("ready",async ()=>{
    console.log("ready")
    var playerDatabase = mclient.db("Player").collection("Player")
    Database.playerDatabase = playerDatabase
    Database.attackDatabase = mclient.db("Player").collection("Attack")
    Database.inventoryDatabase = mclient.db("Player").collection("Inventory")
    Database.boxDatabase = mclient.db("Player").collection("Box")
    Database.playerServerDatabase = mclient.db("Player").collection("PlayerServer")
    Database.playerCooldownDatabase = mclient.db("Player").collection("Cooldown")
    Database.dropDatabase = mclient.db("Player").collection("Drop")
    await Cache.init()
    PlayerCreator.client = client
    Map.client = client
    await new Map()
        .new()

})

client.on("messageCreate",async message=>{
    console.log(message.content)
    //console.log(message.content.match(MessageMentions.USERS_PATTERN))
    if (commands.find(c=>message.content.replace(prefix,"").startsWith(c.command))){
        var commandFound:commandFile = commands.find(c=>message.content.replace(prefix,"").startsWith(c.command))
        if (commandFound.needAlive){
            var player = await Cache.playerFind(message.author.id)
            if (message.channel instanceof TextChannel || message.channel instanceof ThreadChannel){
                player.lastChannel = message.channel
            }
            player.addServer(message.guild.id)
            if (!player || player.data.dead || player.data.position == null){
                message.channel.send({embeds:[EmbedConstructor.needRespawn()]})
            }else{
                const start = require("./commands/"+commandFound.file)
            
                start({"message":message})
            }
        }else{
            const start = require("./commands/"+commandFound.file)
            
            start({"message":message})
        }
    }
})
