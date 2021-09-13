import Discord, { CommandInteraction, Intents, Interaction, Message, MessageMentions, TextChannel, ThreadChannel } from "discord.js"
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
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
    console.log(process.env.discordtoken)
    const rest = new REST({ version: '9' }).setToken(process.env.discordtoken);
    await rest.post(
        Routes.applicationGuildCommands("839149703132086273", "839149428962885652"),
        { body: {
            "name": "use",
            "description": "Utilise une arme de votre inventaire"
          }},
    );

})

async function onMessageInteraction(type:"MESSAGE"|"INTERACTION",message?:Message,interaction?:CommandInteraction){
    console.log(interaction)
    var commandFound = type=="MESSAGE"?commands.find(c=>message.content.replace(prefix,"").startsWith(c.command)): commands.find(c=>interaction.commandName==c.command)
    if (commandFound){
        console.log(commandFound)
        if (commandFound.needAlive){
            var player = await Cache.playerFind(type=="MESSAGE"?message.author.id:interaction.user.id)
            var channelSent = type=="MESSAGE"?message.channel:interaction.channel
            if (channelSent instanceof TextChannel || channelSent instanceof ThreadChannel){
                player.lastChannel = channelSent
                player.addServer(channelSent.guild.id)
            }
            if (!player || player.data.dead || player.data.position == null){
                message.channel.send({embeds:[EmbedConstructor.needRespawn()]})
            }else{
                const start = require("./commands/"+commandFound.file)
            
                start({"type":type,"message":message,"interaction":interaction,channelSent:channelSent})
            }
        }else{
            const start = require("./commands/"+commandFound.file)
            var channelSent = type=="MESSAGE"?message.channel:interaction.channel
            start({"type":type,"message":message,"interaction":interaction,channelSent:channelSent})
        }
    }
}

client.on("interactionCreate",async interaction=>{
    if (!interaction.isCommand()) return
    await interaction.deferReply()
    await onMessageInteraction("INTERACTION",undefined,interaction)
})



client.on("messageCreate",async message=>{
    onMessageInteraction("MESSAGE",message)
})
