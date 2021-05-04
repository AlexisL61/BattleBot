import { MessageEmbed } from "discord.js";
import Player from "../player/Player";

export default class EmbedConstructor{
    /**
     * playerProfil
     */
    public static playerProfil(player:Player):MessageEmbed {
        var embed = new MessageEmbed()
        embed.setTitle("Profil de "+player.discordUser.tag)
        embed.setDescription("Pièces: "+player.data.coins)
        return embed;
    }
}