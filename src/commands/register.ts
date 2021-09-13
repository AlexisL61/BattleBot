
import { MessageButton, Client, Message, MessageActionRow } from "discord.js"
import Cache from "../class/cache/Cache"
import commandSender from "../types/commandSender"
import CommandSenderManager from "../utility/CommandSenderManager"
import EmbedConstructor from "../utility/EmbedConstructor"

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)
    if (thisPlayer.data.position){} 
    CommandSenderManager.reply(data,"👋 Bienvenue sur BattleBot ! Regardez vos messages privés")
    
    const firstRow = new MessageActionRow()
	
    var yesBtn = new MessageButton({customId:"yes",label:"Oui !",style:"PRIMARY"})

    firstRow.addComponents(yesBtn);
    var messageSent = await thisPlayer.discordUser.send({embeds:[EmbedConstructor.registerEmbed(0)],components:[firstRow]})

    var firstClicked = await messageSent.awaitMessageComponent()
    await firstClicked.deferUpdate()

    const secondRow = new MessageActionRow()
	
    var acceptBtn = new MessageButton({customId:"accept",label:"Accepter",style:"PRIMARY"})
    var refuseBtn = new MessageButton({customId:"refuse",label:"Refuser",style:"DANGER"})

    secondRow.addComponents(acceptBtn,refuseBtn);
    
    await messageSent.edit({embeds:[EmbedConstructor.registerEmbed(1)],components:[secondRow]})

    var secondClicked = await messageSent.awaitMessageComponent()
    await secondClicked.deferUpdate()
    if (secondClicked.customId=="refuse") return messageSent.edit({"embeds":[EmbedConstructor.registerEmbed(2)]})
    
    const thirdRow = new MessageActionRow()
    var goBtn = new MessageButton({customId:"go",label:"C'est parti !",style:"PRIMARY"})
    thirdRow.addComponents(goBtn)

    messageSent.edit({embeds:[EmbedConstructor.registerEmbed(3)],components:[thirdRow]})

    var thirdClicked = await messageSent.awaitMessageComponent()
    await thirdClicked.deferUpdate()
    messageSent.channel.send({"embeds":[EmbedConstructor.registerEmbed(4,{"id":data.message.author.id})]})
    thisPlayer.setRandomPosition()
    messageSent.channel.send({"embeds":[EmbedConstructor.registerEmbed(5,{"pos":{"x":thisPlayer.data.position.x,"y":thisPlayer.data.position.y}})]})
}