import { MessageMentions, TextChannel, ThreadChannel } from "discord.js";
import Cache from "../class/cache/Cache";
import PlayerCreator from "../class/player/PlayerCreator";
import Weapon from "../class/weapon/Weapon";
import { weapons } from "../static/weaponList";
import commandSender from "../types/commandSender";
import useWeapon from "../types/useWeapon";
import EmbedConstructor from "../utility/EmbedConstructor";

export = async function(data:commandSender){
    const userId = data.message.author.id
    var thisPlayer = await Cache.playerFind(userId)
    console.log(thisPlayer.hasCooldown("ATTACK"))
    if (thisPlayer.hasCooldown("ATTACK").result==true){
        return data.message.channel.send({embeds:[EmbedConstructor.attackCooldown()]})
    }
    var weaponTable = data.message.content.split(" ")
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
        await data.message.channel.send({embeds:[EmbedConstructor.askWeapon(thisPlayer)]})
        var messageCollected =await data.message.channel.awaitMessages({filter:(m)=>m.author.id == data.message.author.id,max:1})
        weaponFound = Weapon.findWeapon(messageCollected.first().content)
        weaponString = messageCollected.first().content
    }
    if (weaponFound){
        var weaponIndex = thisPlayer.searchInInventory(weaponString)
        console.log(thisPlayer.inventory)
        if (weaponIndex!=-1){
            var weapon = thisPlayer.inventory[weaponIndex]
            if (data.message.channel instanceof TextChannel || data.message.channel instanceof ThreadChannel){
                thisPlayer.lastChannel = data.message.channel
            }
            var resultUse:useWeapon = await weapon.use(thisPlayer,data.message)
            data.message.channel.send({embeds:[EmbedConstructor.weaponUse(weapon,resultUse.data.message)]})
            if (resultUse.success){
                thisPlayer.addCooldown("ATTACK",5*60)
                thisPlayer.removeInInventory(weaponIndex)
            }
        }else{
            data.message.channel.send({embeds:[EmbedConstructor.weaponNotFoundInInventory(Weapon.getWeaponData(weaponFound))]})
        }
    }else{
        data.message.channel.send({embeds:[EmbedConstructor.weaponNotFound()]})
    }
}