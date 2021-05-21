import { MessageEmbed } from "discord.js";
import Player from "../class/player/Player";
import Weapon from "../class/weapon/Weapon";
import { rarities } from "../static/rarityList";
import weaponType from "../types/weaponType";

export default class EmbedConstructor{
    /**
     * playerProfil
     */
    public static playerProfil(player:Player):MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Profil de "+player.discordUser.tag)
        var lifeStats = player.getLifeBarre()
        embed.addField("Stats vie",lifeStats.health+" "+player.data.lifeStats.health+" ❤️\n"+lifeStats.shield+" "+player.data.lifeStats.shield+" 🛡️\n")
        embed.addField("Argent",player.data.coins+" 💸")
       return embed;
    }

    public static killOrAssist(player:Player,deadPlayer:Player,coins:number):MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Kill ou assist")
        embed.setDescription("Vous avez tué ou aidé à tuer le joueur: **"+deadPlayer.discordUser.tag+"**\nVous recevez donc "+coins+" 💸 pour un total de "+player.data.coins+" 💸")
        return embed;
    }

    public static dead(killer:Player, coins:number):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Mort")
        embed.setDescription("Vous avez été tué par le joueur **"+killer.discordUser.tag+"**\nVous avec perdu un total de "+coins+" 💸")
        return embed;
    }

    public static weaponNotFound():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Arme non trouvée")
        embed.setDescription("Arme non trouvée dans la liste des armes")
        return embed
    }

    public static weaponNotFoundInInventory(weapon:weaponType):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Arme non trouvée dans l'inventaire")
        embed.setDescription("Arme ("+weapon.name.fr+") non trouvée dans votre inventaire")
        return embed
    }

    public static weaponUse(weapon:Weapon, message:string):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Arme utilisée")
        embed.setDescription("Vous utilisez l'arme: "+weapon.emoji+" "+weapon.name.fr+"\n\n"+message)
        return embed
    }

    public static respawnSuccess():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Respawn")
        embed.setDescription("Respawn effetué avec succès, bon retour dans le jeu!")
        return embed
    }

    public static respawnFailed():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Respawn")
        embed.setDescription("Vous ne pouvez pas respawn: vous n'êtes pas mort")
        return embed
    }

    public static needRespawn():MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Non respawn")
        embed.setDescription("Vous devez respawn avec la commande b!respawn pour utiliser cette commande")
        return embed
    }

    public static playerInventory(p:Player):MessageEmbed{
        var data = Weapon.sortWeaponForInventory(p)
        var embed = new MessageEmbed()
        embed.setTitle("Inventaire")
        for (var i in rarities){
            var rarityText = ""
            for (var w of data[i]){
                rarityText += w.weapon.emoji+" "+w.weapon.name.fr+" x"+w.number+"\n"
            }
            if (rarityText == ""){
                rarityText = "Aucune arme"
            }
            embed.addField(rarities[i].name.fr,rarityText)
        }
        return embed
    }

    public static waitMention(toMention:string):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Mention requise")
        embed.setDescription("Veuillez mentionner "+toMention+" dans votre prochain message")
        return embed
    }

    public static useCancel(reason:string):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Utilisation annulée")
        embed.setDescription("L'Utilisation a été annulée pour la raison suivante: "+reason)
        return embed
    }
}