import { MessageEmbed } from "discord.js"
import Cache from "../class/cache/Cache"
import ShopItem from "../class/shop/ShopItem"
import commandSender from "../types/commandSender"
import ComponentsConstructor from "../utility/ComponentsConstructor"
import EmbedConstructor from "../utility/EmbedConstructor"


export = async function(data:commandSender){
    const userId = data.message.author.id
    var thisPlayer = await Cache.playerFind(userId)
    var messageSent = await data.message.channel.send({embeds:[EmbedConstructor.shopEmbed()],components:ComponentsConstructor.shopComponents()})
    var component = await messageSent.awaitMessageComponent({filter:c=>c.member.user.id==thisPlayer.id})
    var num = parseInt(component.customId)
    var itemChoosen = ShopItem.shop[num]
    
}