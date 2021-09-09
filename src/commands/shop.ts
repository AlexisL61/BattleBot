import { MessageEmbed, MessageSelectMenu } from "discord.js"
import Cache from "../class/cache/Cache"
import Drop from "../class/map/Drop"
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
    component.deferUpdate()
    await messageSent.edit({"embeds":[EmbedConstructor.shopItem(itemChoosen)],components:ComponentsConstructor.buyItemComponents(itemChoosen)})
    var component = await messageSent.awaitMessageComponent({filter:c=>c.member.user.id==thisPlayer.id})
    component.deferUpdate()
    if (component.isSelectMenu()){
        console.log("oh")
        var numSelected = parseInt(component.values[0])
        var price = numSelected*itemChoosen.price
        if (thisPlayer.data.coins>=price){
            await messageSent.edit({"embeds":[EmbedConstructor.validationShopPurchase(itemChoosen,numSelected)],components:ComponentsConstructor.validatePurchaseComponent()})
            var choiceSelected = await messageSent.awaitMessageComponent({filter:(c)=>c.member.user.id == thisPlayer.id})
            choiceSelected.deferUpdate()
            if ( choiceSelected.customId == "validate"){
                await messageSent.edit({"embeds":[EmbedConstructor.purchaseSuccess(itemChoosen.dropTime*numSelected)],components:ComponentsConstructor.validatePurchaseComponent()})
                var finalBoxArray = []
                for (var j=0;j<numSelected;j++){
                    finalBoxArray.push({type:"box",id:itemChoosen.getItem().id})
                }
                var thisDrop = new Drop({timeAvailable:itemChoosen.dropTime*numSelected*1000+Date.now(),position:thisPlayer.getRandomPositionAround(),server:data.message.guild.id,owner:{type:"PLAYER",player:thisPlayer.id},content:finalBoxArray})
                thisDrop.addInDatabase()
            }
        }else{
            await messageSent.edit({"embeds":[EmbedConstructor.notEnoughCoinsShop(itemChoosen,numSelected)]})
        }
    }
}