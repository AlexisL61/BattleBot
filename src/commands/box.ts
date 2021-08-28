import { MessageMentions } from "discord.js";
import Cache from "../class/cache/Cache";
import PlayerCreator from "../class/player/PlayerCreator";
import Weapon from "../class/weapon/Weapon";
import { weapons } from "../static/weaponList";
import commandSender from "../types/commandSender";
import useWeapon from "../types/useWeapon";
import EmbedConstructor from "../utility/EmbedConstructor";

export = async function(data:commandSender){
    const userId = data.message.author.id
    const thisPlayer = await Cache.playerFind(userId)
    await data.message.channel.send({embeds:[EmbedConstructor.playerBoxes(thisPlayer)]})
    const messageCollection = await data.message.channel.awaitMessages({filter:(m)=>m.author.id==userId,"max":1})
    if (parseInt(messageCollection.first().content)){
        const number = parseInt(messageCollection.first().content)
        if (number>0 && number<=thisPlayer.box.length){
            const boxToOpen = thisPlayer.box[number-1]
            const weaponOpened = await boxToOpen.open()
            data.message.channel.send({embeds:[EmbedConstructor.boxOpened(weaponOpened,boxToOpen)]})
        }else{
            data.message.channel.send("Le message envoyé n'est pas un nombre correspondant à une box. Commande annulée")
        }
    }else{
        data.message.channel.send("Le message envoyé n'est pas un nombre. Commande annulée")
    }
}