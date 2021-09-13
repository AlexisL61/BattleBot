import { MessageMentions, TextChannel, ThreadChannel } from "discord.js";
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
    var thisPlayer = await Cache.playerFind(userId)
    console.log(thisPlayer.hasCooldown("ATTACK"))
    if (thisPlayer.hasCooldown("ATTACK").result==true){
        return CommandSenderManager.reply(data,{embeds:[EmbedConstructor.attackCooldown()]})
    }
    var weaponTable = []
    data.type=="MESSAGE"?weaponTable = data.message.content.split(" "):null;
    weaponTable.splice(0,1)
    var weaponString = weaponTable.join(" ")
    var mentionToErase = weaponString.match(MessageMentions.USERS_PATTERN)
    if (mentionToErase!=null){
        mentionToErase.forEach((m)=>{
            weaponString = weaponString.replace(m,"")
        })
    }
    weaponString = weaponString.trim()
    var weaponFound = Weapon.findWeapon(weaponString)
    if (!weaponFound){
        var messageSent = await CommandSenderManager.reply(data,{embeds:[EmbedConstructor.askWeapon(thisPlayer)]})
        var messageCollected =await messageSent.channel.awaitMessages({filter:(m)=>m.author.id == userId,max:1})
        weaponFound = Weapon.findWeapon(messageCollected.first().content)
        weaponString = messageCollected.first().content
    }
    if (weaponFound){
        var weaponIndex = thisPlayer.searchInInventory(weaponString)
        console.log(thisPlayer.inventory)
        if (weaponIndex!=-1){
            var weapon = thisPlayer.inventory[weaponIndex]
            if (messageSent.channel instanceof TextChannel || messageSent.channel instanceof ThreadChannel){
                thisPlayer.lastChannel = messageSent.channel
            }
            var resultUse:useWeapon = await weapon.use(thisPlayer,data)
            CommandSenderManager.reply(data,{embeds:[EmbedConstructor.weaponUse(weapon,resultUse.data.message)]})
            if (resultUse.success){
                thisPlayer.addCooldown("ATTACK",5*60)
                thisPlayer.removeInInventory(weaponIndex)
            }
        }else{
            CommandSenderManager.reply(data,{embeds:[EmbedConstructor.weaponNotFoundInInventory(Weapon.getWeaponData(weaponFound))]})
        }
    }else{
        CommandSenderManager.reply(data,({embeds:[EmbedConstructor.weaponNotFound()]}))
    }
}