import { MessageMentions } from "discord.js";
import Cache from "../class/cache/Cache";
import PlayerCreator from "../class/player/PlayerCreator";
import Weapon from "../class/weapon/Weapon";
import { weapons } from "../static/weaponList";
import commandSender from "../types/commandSender";
import useWeapon from "../types/useWeapon";
import CommandSenderManager from "../utility/CommandSenderManager";
import EmbedConstructor from "../utility/EmbedConstructor";

export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    const thisPlayer = await Cache.playerFind(userId)
    var messageReceived = await CommandSenderManager.reply(data,{embeds:[EmbedConstructor.playerBoxes(thisPlayer)]})
    const messageCollection = await messageReceived.channel.awaitMessages({filter:(m)=>m.author.id==userId,"max":1})
    if (parseInt(messageCollection.first().content)){
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
    }
}