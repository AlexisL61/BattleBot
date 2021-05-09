import { DMChannel, MessageEmbed, NewsChannel, TextChannel, User } from "discord.js";
import databaseAttacker from "../../types/database/attacker";
import databasePlayer from "../../types/database/player";
import EmbedConstructor from "../../utility/EmbedConstructor";
import Cache from "../cache/Cache";
import Database from "../database/Database";
import Weapon from "../weapon/Weapon";
import PlayerCreator from "./PlayerCreator";


export default class Player {
    private _id: string;
    private _discordUser: User;
    private _data: databasePlayer;
    private _inventory: Array<Weapon> = [new Weapon("cailloux"),new Weapon("cailloux"),new Weapon("cailloux"), new Weapon("bandage")];
    private _lastChannel: TextChannel | DMChannel | NewsChannel;

    /**
     * Représente un joueur sur BattleBot
     * @param $discordUser Utilisateur discord
     * @param $data Données utilisateur dans la bdd
     */
	constructor($discordUser: User, $data:databasePlayer) {
        this.id = $discordUser.id
		this.discordUser = $discordUser;
        this.data = $data;
	}

    /**
     * Cherche une arme dans l'inventaire du joueur
     * @param weaponName Nom de l'arme
     * @returns L'index de l'arme dans l'inventaire
     */
    public searchInInventory(weaponName:string):number{
        return this.inventory.findIndex(w=>w.name.fr==weaponName)
    }

    public async addAttackDone(target:string, damage:number){
        var attackAlreadyDone:databaseAttacker = await Database.attackDatabase.findOne({"attacker":this._id, "target":target})
        if (attackAlreadyDone!=undefined){
            await Database.attackDatabase.updateOne({"attacker":this._id,"target":target},{"$set":{"attacker":this._id,"target":target,"damage":attackAlreadyDone.damage+damage}})
        }else{
            await Database.attackDatabase.insertOne({"attacker":this._id,"target":target,"damage":damage})
        }
    }

    public infligeDegats(totalDegats:number){
        for (var i =0;i<totalDegats;i++){
            if (this._data.lifeStats.shield>0){
                this._data.lifeStats.shield--
            }else{
                if (this._data.lifeStats.health>0){
                    this._data.lifeStats.health--
                }
            }
        }
        this.save()
    }

    public checkIfDead(killer:Player):boolean{
        if (this.data.lifeStats.health <= 0 && !this.data.dead){
            this.data.dead = true
            this.sendMp(EmbedConstructor.dead(killer,Math.floor(this.data.coins*0.20)))
            this.giveDeathPrize()
            return true
        }
        return false
    }

    public async giveDeathPrize(){
        var moneyToGive = Math.floor(this.data.coins*0.20)
        this._data.coins-=moneyToGive
        this.save()
        var attackers = await this.getAllAttackers()
        var totalDamage = 0
        for (var i in attackers){
            totalDamage+=attackers[i].attack.damage
        }
        for (var i in attackers){
            const coinsToReceive = Math.floor(attackers[i].attack.damage*moneyToGive/totalDamage)
            attackers[i].player._data.coins += coinsToReceive
            attackers[i].player.save()
            attackers[i].player.sendMp(EmbedConstructor.killOrAssist(attackers[i].player,this,coinsToReceive))
        }
        await this.removeAllAttackers()
    }

    public async getAllAttackers():Promise<Array<{player:Player,attack:databaseAttacker}>>{
        var attackers:Array<databaseAttacker>= await Database.attackDatabase.find({"target":this.id}).toArray()
        var finalAttackers:Array<Player> = []
        console.log(attackers)
        for (var i in attackers){
            finalAttackers.push(await Cache.playerFind(attackers[i].attacker))
        }
        var finalReturn:Array<{player:Player,attack:databaseAttacker}> = []
        for (var i in attackers){
            finalReturn.push({"attack":attackers[i],"player":finalAttackers[i]})
        }
        return finalReturn
    }

    public async removeAllAttackers():Promise<void>{
         await Database.attackDatabase.deleteMany({"target":this.id})
         return
    }

    public async save():Promise<void>{
        if (await Database.playerDatabase.findOne({"id":this.id})){
            await Database.playerDatabase.updateOne({"id":this.id},{"$set":this._data})
        }else{
            await Database.playerDatabase.insertOne(this._data)
        }
    }

    public getLifeBarre():{"health":string,"shield":string}{
        var finalHealth = ""
        if (this.data.lifeStats.health>0){
            finalHealth+="<:StartingHealth:840539877958483998>"
        }else{
            finalHealth+="<:EmptyStartingHealth:840547841700397076>"
        }
        for (var i =1;i<=8;i++){
            if (this.data.lifeStats.health>i*10){
                finalHealth+="<:MiddleHealth:840539897797804032>"
            }else{
                finalHealth+="<:MiddleEmpty:840547858960744459>"
            }
        }
        if (this.data.lifeStats.health==100){
            finalHealth+="<:EndingHealth:840539914818682880>"
        }else{
            finalHealth+="<:EmptyEndingHealth:840547875385769994>"
        }
        var finalShield = ""
        if (this.data.lifeStats.shield>0){
            finalShield+="<:StartingShield:840541071490285638>"
        }else{
            finalShield+="<:EmptyStartingShield:840547941760368651>"
        }
        for (var i =1;i<=8;i++){
            if (this.data.lifeStats.shield>i*10){
                finalShield+="<:MiddleShield:840541092261003265>"
            }else{
                finalShield+="<:MiddleEmpty:840547858960744459>"
            }
        }
        if (this.data.lifeStats.shield==100){
            finalShield+="<:EndingShield:840541109188821012>"
        }else{
            finalShield+="<:EmptyEndingShield:840547994319585332>"
        }
        return {"health":finalHealth,"shield":finalShield}
    }

    public async sendMp(message:string|MessageEmbed){
        this._discordUser.send(message)
    }

    public get discordUser(): User {
        return this._discordUser;
    }
    public set discordUser(value: User) {
        this._discordUser = value;
    }
    
    public get data(): databasePlayer {
        return this._data;
    }
    public set data(value: databasePlayer) {
        console.log("setter")
        this._data = value;
        //this.checkIfDead()
    }

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    public get inventory(): Array<Weapon> {
        return this._inventory;
    }
    public set inventory(value: Array<Weapon>) {
        this._inventory = value;
    }

    
    public get lastChannel(): TextChannel | NewsChannel | DMChannel {
        return this._lastChannel;
    }
    public set lastChannel(value: TextChannel | NewsChannel | DMChannel) {
        this._lastChannel = value;
    }
}