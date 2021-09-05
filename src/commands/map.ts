import { Message, MessageEmbed } from "discord.js"
import Cache from "../class/cache/Cache"
import Player from "../class/player/Player"
import commandSender from "../types/commandSender"
import ComponentsConstructor from "../utility/ComponentsConstructor"
import EmbedConstructor from "../utility/EmbedConstructor"
import TutorialManager from "../utility/TutorialManager"
const idToPos = {"bigdown":{"x":0,"y":100},"smalldown":{"x":0,"y":20},"smallup":{"x":0,"y":-20},"bigup":{"x":0,"y":-100},
                 "bigleft":{"x":-100,"y":-0},"smallleft":{"x":-20,"y":0},"smallright":{"x":20,"y":0},"bigright":{"x":100,"y":0}}

async function mainType(message:Message,thisPlayer:Player){
    var attackablePlayers = await thisPlayer.getAttackablePlayers(message.guild)
    const messageSent = await message.edit({embeds:[await EmbedConstructor.mapEmbed(thisPlayer,attackablePlayers)],components:ComponentsConstructor.mapComponents(thisPlayer)})
    const componentCollector = messageSent.createMessageComponentCollector()
    componentCollector.on("collect",async (interaction)=>{
        console.log(interaction.customId)
        if (interaction.customId=="help"){
            interaction.deferUpdate()
            TutorialManager.tutorial(thisPlayer,messageSent.channel,"map")
        }
        if (interaction.customId=="deplacement"){
            interaction.deferUpdate()
            deplacementType(messageSent,thisPlayer,attackablePlayers)
            componentCollector.stop()
        }
        if (interaction.customId=="nearplayers"){
            interaction.deferUpdate()
            nearPlayersType(messageSent,thisPlayer)
            componentCollector.stop()
        }
        if (interaction.customId=="drop"){
            interaction.deferUpdate()
            var drops = thisPlayer.visibleDrop(thisPlayer.lastChannel.guild.id).filter(d=>d.timeAvailable<Date.now())
            var message = "Vous avez ouvert "+drops.length+" drop(s) et récupéré : \n\n"
            for (var i in drops){
                drops[i].open(thisPlayer)
                message+=drops[i].getContentString()+"\n"
            }
            componentCollector.stop()
        }
    })
}

async function nearPlayersType(message:Message,p:Player){
    await message.edit({embeds:[await EmbedConstructor.mapNearEnnemy(p,p.lastChannel.guild)],components:ComponentsConstructor.mapNearEnnemy()})
    const componentCollector = message.createMessageComponentCollector()
    componentCollector.on("collect",(interaction)=>{
        if (interaction.customId=="cancel"){
            mainType(message,p)
            interaction.deferUpdate()
            componentCollector.stop()
        }
    })
}

async function deplacementType(message:Message,p:Player,opponents:Array<Player>){
    var pos = {x:p.getRealPosition().x,y:p.getRealPosition().y}
    var zoom = 3
    message.edit({embeds:[await EmbedConstructor.mapMoveEmbed(p,pos,zoom,opponents)],components:ComponentsConstructor.mapMoveComponents(zoom,p.data.movement!=undefined)})
    var messageComponentcollector = message.createMessageComponentCollector({filter:(interaction)=>interaction.user.id==p.id})
    messageComponentcollector.on("collect",async (interaction)=>{
        if (idToPos[interaction.customId]){
            pos.x+=idToPos[interaction.customId].x
            pos.y+=idToPos[interaction.customId].y
        }
        if (interaction.customId=="center"){
            pos = {x:p.getRealPosition().x,y:p.getRealPosition().y}
        }
        if (interaction.customId=="zoomminus"){
            zoom>1?zoom--:zoom;
        }
        if (interaction.customId=="zoomplus"){
            zoom<5?zoom++:zoom;
        }
        if (interaction.customId=="move"){
            p.data.position = p.getRealPosition()
            p.data.movement = {position:{x:pos.x,y:pos.y},start:Date.now()}
            p.save()
            message.channel.send("Vous vous déplacez vers "+p.data.movement.position.x+" ; "+p.data.movement.position.y+"\nVous y arriverez "+p.getTimeLeft())
        }
        if (interaction.customId=="cancel"){
            mainType(message,p)
            messageComponentcollector.stop()
        }
        if (interaction.customId=="stop-move"){
            p.data.position = p.getRealPosition()
            p.data.movement = undefined
            p.save()
        }
        interaction.deferUpdate()
        message.edit({embeds:[await EmbedConstructor.mapMoveEmbed(p,pos,zoom,opponents)],components:ComponentsConstructor.mapMoveComponents(zoom,p.data.movement!=undefined)})
        
    })
}

export = async function(data:commandSender){
    const userId = data.message.author.id
    const thisPlayer = await Cache.playerFind(userId)
    var playerCoords = thisPlayer.getRealPosition()
    mainType(await data.message.channel.send({embeds:[new MessageEmbed().setDescription("Chargement")]}),thisPlayer)
}