import { MessageActionRow, MessageButton } from "discord.js";


export default class ComponentsConstructor{
    public static mapComponents():Array<MessageActionRow>{
        const firstRow = new MessageActionRow()
	
        var deplacementBtn = new MessageButton({customId:"deplacement",label:"Se déplacer",style:"PRIMARY"})
        var nearPlayersBtn = new MessageButton({customId:"nearplayers",label:"Joueur(s) près de vous",style:"PRIMARY"})

        firstRow.addComponents(deplacementBtn,nearPlayersBtn);
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
}