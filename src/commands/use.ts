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
    var thisPlayer = await Cache.playerFind(userId)
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
    console.log(weaponString)
    var weaponFound = Weapon.findWeapon(weaponString)
    if (weaponFound){
        var weaponIndex = thisPlayer.searchInInventory(weaponString)
        if (weaponIndex!=-1){
            var weapon = thisPlayer.inventory[weaponIndex]
            thisPlayer.lastChannel = data.message.channel
            var resultUse:useWeapon = await weapon.use(thisPlayer,data.message)
            if (resultUse.success){
                data.message.channel.send(EmbedConstructor.weaponUse(weapon,resultUse.data.message))
                thisPlayer.removeInInventory(weaponIndex)
            }
        }else{
            data.message.channel.send(EmbedConstructor.weaponNotFoundInInventory(Weapon.getWeaponData(weaponFound)))
        }
    }else{
        data.message.channel.send(EmbedConstructor.weaponNotFound())
    }
}