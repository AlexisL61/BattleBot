import { MessageEmbed } from "discord.js";
import Box from "../class/box/Box";
import Player from "../class/player/Player";
import Weapon from "../class/weapon/Weapon";
import box from "../commands/box";
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

    public static playerBoxes(p:Player):MessageEmbed{
        var data = p.box
        var embed = new MessageEmbed()
        embed.setTitle("Box")
        var finalDescription = ""
        for (var i in data){
            finalDescription+=(parseInt(i)+1)+". "+data[i].emoji+" "+data[i].name.fr+"\n"
        }
        embed.setDescription(finalDescription)
        return embed
    }

    public static boxOpened(w:Weapon,b:Box):MessageEmbed{
        var embed = new MessageEmbed()
        embed.setTitle("Box ouverte")
        var finalDescription = "Vous avez ouvert la box: **"+b.emoji+" "+b.name.fr+"** et avez obtenu:\n\n"
        finalDescription+=w.emoji+" "+w.name.fr
        embed.setDescription(finalDescription)
        return embed
    }

    public static registerEmbed(type:number,data?:object):object{
        var embed = {}
        embed["title"] = "Inscription"
        if (type == 0){
            embed["description"] = "**__Raven__**:\n\"Bonjour et bienvenue sur BattleBot !\nJe suis Raven et je suis ici pour régler toute la paperasse avant de vous lancer sur l'ïle.\nOn y va ?\""
            embed["color"] = 1455351
        }
        if (type == 1){
            embed["description"] = "**__Raven__**:\n\"Parfait! Allons tout de suite du côté administratif...\nIl y a une charte à signer afin que tout le monde puisse jouer sans triche. Vous devez l'accepter avant de pouvoir commencer l'aventure.\nElle se trouve juste ici: INSERER LIEN ICI\n\nLa charte peut changer à tout moment donc n'hésitez pas à regarder le lien souvent.\""
            embed["color"] = 1455351
        }
        if (type == 2){
            embed["description"] = "**__Raven__**:\n\"Comme vous avez refusé la charte, vous ne pouvez pas participer à l'aventure BattleBot. N'hésitez pas à refaire la commande b!register et accepter la charte pour jouer!\nÀ une prochaine fois!\""
            embed["color"] = 1455351
        }
        if (type == 3){
            embed["description"] = "**__Raven__**:\n\"Super, j'ai tout ce qu'il me faut !\nVoici quelques petites infos pour finir: \n\nComme vous le savez peut-être, BattleBot est médiatisé. Nos présentateurs INSERER NOM ICI et INSERER UN AUTRE NOM ICI font vivre tout ce qu'il se passe sur l'ïle de BattleBot à travers le monde.\nTout ce qu'il s'est passé d'important pendant une journée est donc envoyé sur le serveur support de BattleBot.\n\nNous allons vous fournir aussi un 🤖 \"Lixo\". C'est un robot permettant de vous expliquer comment tout marche sur BattleBot avec l'aide de tutoriels. Il sera disponible lors de votre arrivée sur l'ïle.\n\nVoilà c'est tout ce que j'ai à dire... Un vaisseau de transport est maintenant disponible, vous allez pouvoir débarquer sur l'ïle.\nBonne chance de toute l'équipe de BattleBot !\""
            embed["color"] = 1455351
        }
        if (type == 4){
            embed["title"] = "Annonce"
            embed["description"] = "**__INSERER NOM ICI__**:\n\"Attention tout le monde, un nouveau challenger vient d'entrer sur l'ïle. Accueillez chaleureusement <@"+data["id"]+"> !\""
            embed["color"] = 16678913
            embed["thumbnail"] = {"url":"https://cdn.discordapp.com/attachments/839604520245264404/850845362133663744/Megaphone.png"}
        }
        if (type == 5){
            embed["title"] = "Arrivée sur l'ile"
            embed["description"] = "Vous êtes arrivé sur l'ile en position: **"+data["pos"].x+" ; "+data["pos"].y+"**"
            embed["color"] = 1455351,
            embed["thumbnail"] = "https://cdn.discordapp.com/attachments/840535209723953172/854015410785484830/PointeurFinal.png"
        }
        return embed;
    }
}