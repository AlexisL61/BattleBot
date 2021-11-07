import { MessageMentions, SelectMenuInteraction } from "discord.js";
import Cache from "../class/cache/Cache";
import PlayerCreator from "../class/player/PlayerCreator";
import Weapon from "../class/weapon/Weapon";
import { weapons } from "../static/weaponList";
import commandSender from "../types/commandSender";
import useWeapon from "../types/useWeapon";
import CommandSenderManager from "../utility/CommandSenderManager";
import ComponentsConstructor from "../utility/ComponentsConstructor";
import EmbedConstructor from "../utility/EmbedConstructor";

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    const thisPlayer = await Cache.playerFind(userId)
    var messageReceived = await CommandSenderManager.reply(data,{embeds:[EmbedConstructor.playerBoxes(thisPlayer)],components:ComponentsConstructor.selectBoxToOpen(thisPlayer)})
    const messageComponent = await messageReceived.awaitMessageComponent({filter:c=>c.user.id==userId})
    console.log(messageComponent)
    if (messageComponent instanceof SelectMenuInteraction){
        if (parseInt(messageComponent.values[0])){
            const boxToOpen = thisPlayer.box[parseInt(messageComponent.values[0])]
            const weaponOpened = await boxToOpen.open()
            messageReceived.channel.send({embeds:[EmbedConstructor.boxOpened(weaponOpened,boxToOpen)]})
        }
    }else{
        messageComponent.deferUpdate()
        var totalWeapons =[]
        var totalBox = thisPlayer.box.length
        for (let i=totalBox-1;i>=0;i--){
            var resultBoxOpen = await thisPlayer.box[i].open()
            totalWeapons.push(resultBoxOpen)
        }
        messageReceived.channel.send({embeds:[EmbedConstructor.boxesOpened(totalWeapons)]})
    }
    /*if (parseInt(messageCollection.first().content)){
        const number = parseInt(messageCollection.first().content)
        if (number>0 && number<=thisPlayer.box.length){
            const boxToOpen = thisPlayer.box[number-1]
            const weaponOpened = await boxToOpen.open()
            messageReceived.channel.send({embeds:[EmbedConstructor.boxOpened(weaponOpened,boxToOpen)]})
        }else{
            messageReceived.channel.send("Le message envoyé n'est pas un nombre correspondant à une box. Commande annulée")
        }
    }else{
        messageReceived.channel.send("Le message envoyé n'est pas un nombre. Commande annulée")
    }*/
}