
import { APIMessage, Client, Message } from "discord.js"
import Cache from "../class/cache/Cache"
import commandSender from "../types/commandSender"
import DiscordButtonManager from "../utility/DiscordButtonManager"
import EmbedConstructor from "../utility/EmbedConstructor"
import MessageButton from "../utility/MessageButton"

export = async function(data:commandSender){
    const userId = data.message.author.id
    var thisPlayer = await Cache.playerFind(userId)
    if (thisPlayer.data.position) return 
    data.message.channel.send("👋 Bienvenue sur BattleBot ! Regardez vos messages privés")

    var apiMessage = new MessageButton("",data.message.author.dmChannel)
    apiMessage.addButton("Oui !",1,"yes")
    apiMessage.setEmbed(EmbedConstructor.registerEmbed(0))
    var m = await data.message.author.send(apiMessage)
    var messageSent:Message = m[0]||m ;

    var clicked = await DiscordButtonManager.awaitButtonClicked(messageSent)
    DiscordButtonManager.respondToInteraction(clicked.id,clicked.token)
    if (clicked.status == 1) return

    var apiMessage2 = new MessageButton("",data.message.channel)
    apiMessage2.addButton("Accepter",1,"accept")
    apiMessage2.addButton("Refuser",2,"refuse")
    apiMessage2.setEmbed(EmbedConstructor.registerEmbed(1))
    messageSent.edit(apiMessage2)

    var secondClicked = await DiscordButtonManager.awaitButtonClicked(messageSent)
    DiscordButtonManager.respondToInteraction(secondClicked.id,secondClicked.token)
    if (secondClicked.status == 1) return
    if (secondClicked.data.custom_id=="refuse") return messageSent.edit({"embed":EmbedConstructor.registerEmbed(2)})
    
    var apiMessage3 = new MessageButton("",data.message.channel)
    apiMessage3.addButton("C'est parti !",1,"go")
    apiMessage3.setEmbed(EmbedConstructor.registerEmbed(3))
    messageSent.edit(apiMessage3)

    var thirdClicked = await DiscordButtonManager.awaitButtonClicked(messageSent)
    DiscordButtonManager.respondToInteraction(thirdClicked.id,thirdClicked.token)
    messageSent.channel.send({"embed":EmbedConstructor.registerEmbed(4,{"id":data.message.author.id})})
    thisPlayer.setRandomPosition()
    messageSent.channel.send({"embed":EmbedConstructor.registerEmbed(5,{"pos":{"x":thisPlayer.position.x,"y":thisPlayer.position.y}})})
}