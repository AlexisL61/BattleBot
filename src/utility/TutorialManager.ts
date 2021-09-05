import { TextBasedChannels } from "discord.js";
import Player from "../class/player/Player";
import ComponentsConstructor from "./ComponentsConstructor";
import EmbedConstructor from "./EmbedConstructor";

export default class TutorialManager {
    private static tutorials:Array<{"name":string,"pages":Array<{"title":string,"content":string,"image"?:string}>}> = [
        {"name":"map","pages":[
            {"title":"Map - Introduction - 1/3","content":"La commande b!map est une des commandes phares de BattleBot. Elle permet de se déplacer sur la carte, voir les joueurs à côté de vous sur la carte et récupérer des drops\nCe guide couvrira la plupart des fonctionnalités offertes par cette commande"},
            {"title":"Map - Déplacement - 2/3","content":"En appuyant sur le bouton se déplacer, vous allez pouvoir vous déplacer sur la carte.\n\nTout d'abord, choisissez un emplacement de déplacement grâce aux flèches. Un <:pointer:883434471943176192> apparaitra pour montrer l'emplacement de déplacement.\nLorsque cet emplacement semble approprié, appuyez sur le bouton 🏃 pour vous déplacer.\n\n**Autres boutons** : \n<:annuler:879762938766962779> : Annuler\n<:zoomer:879763352606351401> : Zoomer\n<:dezoomer:879763580411580426> : Dézoomer\n<:marqueur:879764466693177384> : Recentrer sur sa position"},{"title":"Map - Drops - 3/3","content":"Tuto non fait"}]}
    ]
    
    public static async tutorial(p:Player,channel:TextBasedChannels,type:string){
        if (TutorialManager.tutorials.find(t=>t.name==type)){
            var thisTutorial = TutorialManager.tutorials.find(t=>t.name==type)
            var pageNum = 0
            var messageSent = await channel.send({"embeds":[EmbedConstructor.tutorialEmbed(thisTutorial.pages[pageNum])],"components":ComponentsConstructor.tutorialComponents(pageNum,thisTutorial.pages.length)})
            var collector = messageSent.createMessageComponentCollector({filter:(c)=>c.member.user.id==p.id})
            collector.on("collect",(c)=>{
                if (c.customId=="previous" && pageNum!=0){
                    pageNum--
                    messageSent.edit({"embeds":[EmbedConstructor.tutorialEmbed(thisTutorial.pages[pageNum])],"components":ComponentsConstructor.tutorialComponents(pageNum,thisTutorial.pages.length)})
                }
                if (c.customId=="next" && pageNum!=thisTutorial.pages.length-1){
                    pageNum++
                    messageSent.edit({"embeds":[EmbedConstructor.tutorialEmbed(thisTutorial.pages[pageNum])],"components":ComponentsConstructor.tutorialComponents(pageNum,thisTutorial.pages.length)})
                }
                c.deferUpdate()
            })
        }
    }
}