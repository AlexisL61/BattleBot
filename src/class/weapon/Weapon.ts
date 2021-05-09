import { MessageMentions, TextChannel } from "discord.js";
import mention from "../../types/mentions";
import useWeapon from "../../types/useWeapon";
import Effect from "../effect/Effect";
import Player from "../player/Player";
import PlayerCreator from "../player/PlayerCreator";
import { weapons } from "../../static/weaponList";
import weaponType from "../../types/weaponType";
import Cache from "../cache/Cache";
import { rarities } from "../../static/rarityList";
import rarityType from "../../types/rarityType";

export default class Weapon {
    private _id: string;
    private _name: { "fr": string; "en": string; };
    private _emoji: string;
    private _image: string;
    private effect:Effect
    private rarity:rarityType

    constructor(weaponId:string){
        if (Weapon.getWeaponData(weaponId)){
            var w = Weapon.getWeaponData(weaponId)
            this.id = w.id
            this.name = w.name
            this.emoji = w.emoji
            this.image = w.image
            this.effect = w.effect
            this.rarity = rarities.find(r=>r.id==w.rarity)
        }
    }

    public async use(player:Player):Promise<useWeapon>{
        var effectResult = await this.effect.applyEffect(player,player)
        var finalMessage = ""
        finalMessage += effectResult.data.message+"\n"
        if (effectResult.data.dead){
            finalMessage+="\n☠ "+player.discordUser.tag+" est mort\nVos récompenses se trouvent en mp!"
        }
        return {"success":true,"data":{"message":finalMessage}}

        /*var userArray = message.match(MessageMentions.USERS_PATTERN) || [];
        if (userArray.length == this.mentions.filter(m=>m.type=="user").length){
            var finalMessage =""
            for (var j in this.effects){
                var thisUser:Player;
                var correspondingMention = this.mentions.findIndex(m=>m.id==this.effects[j].mentionTarget)
                if (correspondingMention == -1){
                    thisUser = player
                } else  {
                    thisUser = await Cache.playerFind(userArray[correspondingMention].replace("<@","").replace("!","").replace(">",""))
                }
                
                var effectResult = await this.effects[j].applyEffect(player,thisUser)
                finalMessage += effectResult.data.message+"\n"
                if (effectResult.data.dead){
                    finalMessage+="\n☠ "+player.discordUser.tag+" est mort\nVos récompenses se trouvent en mp!"
                    return {"success":true,"data":{"message":finalMessage}}
                }
            }
            return {"success":true,"data":{"message":finalMessage}}
        }else{
            return {"success":false,"data":{"message":""}}
        }*/
    }

    public toString():string{
        return this.emoji+" "+this._name.fr
    }

    public static getWeaponData(weaponId:string):weaponType{
        if (weapons.find(w=>w.id==weaponId)){
            return weapons.find(w=>w.id==weaponId)
        }else{
            return undefined
        }
    }

    /**
     * Cherche une arme dans la liste des armes
     * @param weapon Le nom de larme à chercher
     * @returns L'identifiant de l'arme
     */
    public static findWeapon(weapon:string):string{
        if (weapons.find(w=>w.name.fr == weapon)){
            return weapons.find(w=>w.name.fr == weapon).id
        }
        return undefined
    }

    public static sortWeaponForInventory(p:Player){
        var weapons = p.inventory
        var embedTable:Array<Array<{"weapon":Weapon,"number":number}>> = []
        for (var rarity of rarities){
            var theseWeapons = weapons.filter(w=>w.rarity==rarity)
            var finalTable:Array<{"weapon":Weapon,"number":number}> = []
            for (var weapon of weapons){
                var found = finalTable.find(w=>w.weapon.id==weapon.id)
                if (found){
                    found.number++
                }else{
                    finalTable.push({"number":1,"weapon":weapon})
                }
            }
            embedTable.push(finalTable)
        }
        return embedTable
    }

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get name(): { "fr": string; "en": string; } {
        return this._name;
    }
    public set name(value: { "fr": string; "en": string; }) {
        this._name = value;
    }
    public get emoji(): string {
        return this._emoji;
    }
    public set emoji(value: string) {
        this._emoji = value;
    }
    public get image(): string {
        return this._image;
    }
    public set image(value: string) {
        this._image = value;
    }
}