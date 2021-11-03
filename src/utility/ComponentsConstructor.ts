import { MessageActionRow, MessageButton, MessageSelectMenu, MessageSelectMenuOptions, MessageSelectOption, MessageSelectOptionData, SelectMenuInteraction } from "discord.js";
import Player from "../class/player/Player";
import Resource from "../class/resource/Resource";
import ShopItem from "../class/shop/ShopItem";
import EmojiHelper from "./EmojiHelper";


export default class ComponentsConstructor{
    public static mapComponents(p:Player):Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
	
        var deplacementBtn = new MessageButton({customId:"deplacement",label:"Se déplacer",style:"PRIMARY"})
        var nearPlayersBtn = new MessageButton({customId:"nearplayers",label:"Joueur(s) près de vous",style:"PRIMARY"})
        var dropBtn = new MessageButton({customId:"drop",label:"Ouvrir des drops",style:"SUCCESS",disabled:p.visibleDrop(p.lastChannel.guild.id).filter(d=>d.timeAvailable<Date.now()).length==0})
        var helpBtn = new MessageButton({customId:"help",label:"Aide",style:"SECONDARY"})

        firstRow.addComponents(deplacementBtn,nearPlayersBtn,dropBtn,helpBtn);
        return [firstRow]
    }

    public static mapNearEnnemy():Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
	    firstRow.addComponents(
            new MessageButton({customId:"cancel",emoji:"879762938766962779",style:"PRIMARY"}),
        )
        return [firstRow]
    }

    public static mapMoveComponents(zoom?:number,moving?:boolean):Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
	    firstRow.addComponents(
            new MessageButton({customId:"cancel",emoji:"879762938766962779",style:"PRIMARY"}),
            new MessageButton({customId:"zoomplus",emoji:"879763352606351401",style:"PRIMARY",disabled:zoom==5}),
            new MessageButton({customId:"bigup",emoji:"⏫",style:"SECONDARY"}),
            new MessageButton({customId:"-",emoji:"▪️",style:"SECONDARY",disabled:true}),
            new MessageButton({customId:"--",emoji:"▪️",style:"SECONDARY",disabled:true})
        )
        const secondRow = new MessageActionRow()
	    secondRow.addComponents(
            new MessageButton({customId:"---",emoji:"▪️",style:"SECONDARY",disabled:true}),
            new MessageButton({customId:"zoomminus",emoji:"879763580411580426",style:"PRIMARY",disabled:zoom==1}),
            new MessageButton({customId:"smallup",style:"SECONDARY",emoji:"🔼"}),
            new MessageButton({customId:"-a",emoji:"▪️",style:"SECONDARY",disabled:true}),
            new MessageButton({customId:"--b",emoji:"▪️",style:"SECONDARY",disabled:true})
        )
        const thirdRow = new MessageActionRow()
	    thirdRow.addComponents(
            new MessageButton({customId:"bigleft",emoji:"⏪",style:"SECONDARY"}),
            new MessageButton({customId:"smallleft",emoji:"⬅️",style:"SECONDARY"}),
            new MessageButton({customId:"center",style:"SECONDARY",emoji:"879764466693177384"}),
            new MessageButton({customId:"smallright",emoji:"➡️",style:"SECONDARY"}),
            new MessageButton({customId:"bigright",emoji:"⏩",style:"SECONDARY"})
        )
        const fourthRow = new MessageActionRow()
	    fourthRow.addComponents(
            new MessageButton({customId:"-z",emoji:"▪️",style:"SECONDARY",disabled:true}),
            new MessageButton({customId:"-e",emoji:"▪️",style:"SECONDARY",disabled:true}),
            new MessageButton({customId:"smalldown",style:"SECONDARY",emoji:"🔽"}),
            new MessageButton({customId:"-r",emoji:"▪️",style:"SECONDARY",disabled:true}),
            new MessageButton({customId:"-t",emoji:"▪️",style:"SECONDARY",disabled:true})
        )
        const fifthRow = new MessageActionRow()
	    fifthRow.addComponents(
            new MessageButton({customId:"-y",emoji:"▪️",style:"SECONDARY",disabled:true}),
            new MessageButton({customId:"-u",emoji:"▪️",style:"SECONDARY",disabled:true}),
            new MessageButton({customId:"bigdown",style:"SECONDARY",emoji:"⏬"}),
            new MessageButton({customId:"stop-move",emoji:"🛑",style:"PRIMARY",disabled:!moving}),
            new MessageButton({customId:"move",emoji:"🏃",style:"PRIMARY",disabled:false})
        )
        return [firstRow,secondRow,thirdRow,fourthRow,fifthRow]
    }

    public static tutorialComponents(page:number,max:number):Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
	    firstRow.addComponents(
            new MessageButton({customId:"previous",emoji:"⬅️",style:"PRIMARY",disabled:page==0}),
            new MessageButton({customId:"next",emoji:"➡️",style:"PRIMARY",disabled:page>=max-1})
        )
        return [firstRow]
    }

    public static shopComponents():Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
        for (var i in ShopItem.shop){
            firstRow.addComponents(new MessageButton({customId:i,emoji:ShopItem.shop[i].getItem().emoji,label:"Acheter "+ShopItem.shop[i].getItem().name.fr,style:"PRIMARY"}))
        }
        return [firstRow]
    }

    public static buyItemComponents(item:ShopItem):Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
        var options:Array<MessageSelectOptionData> = []
        for (var i = 1;i<26;i++){
            options.push({"label":i.toString()+" ("+item.price*i+"💸)","description":"En acheter "+i.toString(),"value":i.toString(),"default":false,emoji:undefined})
        }
        firstRow.addComponents(new MessageSelectMenu({options:options,"placeholder":"Acheter "+item.getItem().name.fr,customId:"numberToBuy"}))
        return [firstRow]
    }

    public static validatePurchaseComponent():Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
        firstRow.addComponents(new MessageButton({customId:"validate",label:"Valider",style:"SUCCESS"}))
        firstRow.addComponents(new MessageButton({customId:"cancel",label:"Annuler",style:"DANGER"}))
        return [firstRow]
    }

    public static playerResourcesSelectComponent(resourcesAvailable:Array<Resource>,selectLength:number):Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
        const options:Array<MessageSelectOptionData> = []
        if (resourcesAvailable.length!=0 && selectLength<5){
            var availableData = Resource.sortResourceForCookSelection(resourcesAvailable)
            for (var i in availableData){
                options.push({"emoji":EmojiHelper.getEmojiId(availableData[i].resource.emoji),"label":availableData[i].resource.name.fr,"value":availableData[i].resource.databaseId,"default":false,"description":""})
            }
            firstRow.addComponents(new MessageSelectMenu({"customId":"select","placeholder":"Sélectionnez une ressource","options":options}))
        }
        const secondRow = new MessageActionRow()
        secondRow.addComponents(new MessageButton({customId:"cancel",label:"Annuler",style:"DANGER"}))
        secondRow.addComponents(new MessageButton({customId:"cook",label:"Cuisiner",style:"SUCCESS",disabled:selectLength<3}))
        return resourcesAvailable.length!=0 && selectLength<5?[firstRow,secondRow]:[secondRow]
    }

    public static selectFoodToEat(player:Player){
        const firstRow = new MessageActionRow()
        const options:Array<MessageSelectOptionData> = []
        for (var i in player.cookedFoods){
            options.push({"emoji":EmojiHelper.getEmojiId(player.cookedFoods[i].emoji),"label":player.cookedFoods[i].name.fr+" ("+player.cookedFoods[i].getHealingBonus()+")","value":player.cookedFoods[i].databaseId,"default":false,"description":""})
        }
        firstRow.addComponents(new MessageSelectMenu({"customId":"select","placeholder":"Sélectionnez une ressource","options":options}))
        return [firstRow]
    }

    public static selectBoxToOpen(player:Player):Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
        const secondRow = new MessageActionRow()
        if (player.box.length>0){
            secondRow.addComponents(new MessageButton({customId:"open",label:"Tout ouvrir",style:"SUCCESS"}))
            
            if (player.box.length<25){
                const options:Array<MessageSelectOptionData> = []
                for (var i in player.box){
                    options.push({"emoji":EmojiHelper.getEmojiId(player.box[i].emoji),"label":player.box[i].name.fr,"value":i,"default":false,"description":""})
                }
                firstRow.addComponents(new MessageSelectMenu({"customId":"select","placeholder":"Sélectionnez une box","options":options}))
                return [firstRow,secondRow]
            }else{
                return [secondRow]
            }
        }
        return []
    }
}