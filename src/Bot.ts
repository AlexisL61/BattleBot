import Discord from "discord.js"
import Cache from "./cache/Cache";
import PlayerCreator from "./player/PlayerCreator";

import commandFile, { totalCommands } from "./types/commandFile";
import commandSender from "./types/commandSender";
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
    var playerDatabase = mclient.db("Main").collection("Player")
    PlayerCreator.playerDatabase = playerDatabase
    PlayerCreator.client = client
})

client.on("message",(message)=>{
    if (commands.find(c=>c.command==message.content.replace(prefix,""))){
        var commandFound:commandFile = commands.find(c=>c.command==message.content.replace(prefix,""))
        const start = require("./commands/"+commandFound.file)
        
        start({"message":message})
    }
})
