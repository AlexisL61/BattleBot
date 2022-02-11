import { DMChannel, Guild, MessageEmbed, NewsChannel, TextBasedChannels, TextChannel, ThreadChannel, User } from "discord.js";
import { cpuUsage } from "process";
import databaseAttacker from "../../types/database/attacker";
import databaseBox from "../../types/database/box";
import databasePlayer, { databaseClanPlayer } from "../../types/database/player";
import databaseWeapon from "../../types/database/weapon";
import position from "../../types/position";
import EffectsManager from "../../utility/EffectsManager";
import EmbedConstructor from "../../utility/EmbedConstructor";
import Box from "../box/Box";
import Cache from "../cache/Cache";
import Database from "../database/Database";
import Drop from "../map/Drop";
import CookedFood from "../resource/CookedFood";
import Resource from "../resource/Resource";
import Weapon from "../weapon/Weapon";
import PlayerEffect from "./PlayerEffect";
import playerEffect from "../../types/database/playerEffect"
import leagues from "../../static/leagueList";
import ClanPlayer from "./ClanPlayer";
import Clan from "../clan/Clan";


export default class Player {
    static rapidity:number = 1
    static visibilityRadius:number = 500

    private _id: string;
    private _discordUser: User;
    private _data: databasePlayer;
    private _inventory: Array<Weapon> = [];
    private _resources: Array<Resource> = [];
    private _servers:Array<string> = []
    private _cooldowns: Array<cooldown> = [];
    private _lastChannel: TextChannel|ThreadChannel;
    private _box: Array<Box> = [];
    private _cookedFoods: Array<CookedFood> = [];
    private _effects: Array<PlayerEffect> = [];
    
    private _clanPlayer: ClanPlayer;

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

    public async loadAll(){
        var data = await Database.playerDatabase.aggregate([
            {
                $lookup:{
                    from:"Inventory",
                    localField:"id",
                    foreignField:"owner",
                    as:"inventory"
                },
            },
            {
                $lookup:{
                    from:"Box",
                    localField:"id",
                    foreignField:"owner",
                    as:"box"
                },
            },
            {
                $lookup:{
                    from:"Cooldown",
                    localField:"id",
                    foreignField:"player",
                    as:"cooldown"
                },
            },
            {
                $lookup:{
                    from:"Resource",
                    localField:"id",
                    foreignField:"owner",
                    as:"resource"
                },
            },
            {
                $lookup:{
                    from:"CookedFood",
                    localField:"id",
                    foreignField:"owner",
                    as:"cookedFood"
                },
            },
            {
                $lookup:{
                    from:"Effect",
                    localField:"id",
                    foreignField:"owner",
                    as:"effect"
                },
            },
            {
                $lookup:{
                    from:"ClanPlayer",
                    localField:"id",
                    foreignField:"id",
                    as:"clan"
                },
            },
            {
                $match:{
                    "id":this.id
                }
            }
        ])
        var found =await data.toArray()
        found = found[0]
        if (found){
            this.inventory = []
            this.box = []
            this.resources = []
            this.cookedFoods = []
            this.effects = []
            this.cooldowns = []
            this.loadInventory(found.inventory)
            this.loadBoxes(found.box)
            this.loadResources(found.resource)
            this.loadCooldowns(found.cooldown)
            this.loadCookedFood(found.cookedFood)
            this.loadEffects(found.effect)
            await this.loadClan(found.clan)
        }
        console.log(found)
    }

    //--------------------------//
    //----------Clan------------//
    //--------------------------//

    public async loadClan(foundArray:Array<databaseClanPlayer>){
        for (var i in foundArray){
            var found = foundArray[i]
            if (found){
                console.log(found)
                var clan = await Cache.clanFind(found.clan)
                console.log(clan)
                this.clanPlayer = new ClanPlayer(found, clan)
                console.log(this.clanPlayer)
            }
        }
    }

    //--------------------------//
    //--------Inventory---------//
    //--------------------------//

    public async loadInventory(foundArray:Array<databaseWeapon>){
        for (var i in foundArray){
            var found = foundArray[i]
            if (found){
                var w = new Weapon(found.weapon_id)
                w.owner = found.owner
                w.databaseId = found.id
                this.inventory.push(w)
            }
        }
    }

    public async removeInInventory(index:number){
        var weaponRemove = this.inventory.splice(index,1)
        await Database.inventoryDatabase.deleteOne({"id":weaponRemove[0].databaseId})
    }

    public async addInInventory(weapon:string):Promise<Weapon>{
        var id = Date.now().toString();
        var newWeapon = new Weapon(weapon)
        newWeapon.owner = this.id
        newWeapon.databaseId = id
        this.inventory.push(newWeapon)
        await Database.inventoryDatabase.insertOne({"id":newWeapon.databaseId,"owner":this.id,"weapon_id":weapon})
        return newWeapon
    }

    //--------------------------//
    //-----------Box------------//
    //--------------------------//

    public async loadBoxes(foundArray:Array<databaseBox>){
        for (var i in foundArray){
            var found = foundArray[i]
            if (found){
                var b = new Box(found.box_id)
                b.owner = found.owner
                b.databaseId = found.id
                this.box.push(b)
            }
        }
        if (foundArray.length == 0){
            this.addInBox("common_box")
        }
    }

    public async removeInBox(index:number){
        var boxRemoved = this.box.splice(index,1)
        await Database.boxDatabase.deleteOne({"id":boxRemoved[0].databaseId})
    }

    public async addInBox(box:string){
        var id = Date.now().toString();
        var newBox = new Box(box)
        newBox.owner = this.id
        newBox.databaseId = id
        this.box.push(newBox)
        await Database.boxDatabase.insertOne({"id":newBox.databaseId,"owner":this.id,"box_id":box})
    }

    public visibleDrop(id:string){
        return Drop.getServerDrops(id).filter(d=>d.timeAvailable>Date.now() || this.getDistance(d.position)<Player.visibilityRadius)
    }
    //--------------------------//
    //---------Attaques---------//
    //--------------------------//
    public async loadCooldowns(cooldownsFound){
        this.cooldowns = cooldownsFound
    }

    public async getAttackablePlayers(server:Guild){
        var players:Array<Player> = []
        var playerServers = Cache.playersInServer.get(server.id)
        for (var i in playerServers){
            var memberFetched = undefined
            try {
                memberFetched = await server.members.fetch(playerServers[i])
            } catch (error) {}
            if (playerServers[i]!=this.id && memberFetched){
                var splayer = await Cache.playerFind(playerServers[i])
                console.log(this.getDistance(splayer.getRealPosition()))
                if (splayer!=undefined && !splayer.data.dead && this.getDistance(splayer.getRealPosition())<=Player.visibilityRadius){
                    players.push(splayer)
                }
            }
        }
        console.log(players)
        return players
    }

    public async addAttackDone(target:string, damage:number){
        var attackAlreadyDone:databaseAttacker = await Database.attackDatabase.findOne({"attacker":this._id, "target":target})
        if (attackAlreadyDone!=undefined){
            await Database.attackDatabase.updateOne({"attacker":this._id,"target":target},{"$set":{"attacker":this._id,"target":target,"damage":attackAlreadyDone.damage+damage}})
        }else{
            await Database.attackDatabase.insertOne({"attacker":this._id,"target":target,"damage":damage})
        }
    }

    public async infligeDegats(totalDegats:number){
        for (var i =0;i<totalDegats;i++){
            if (this._data.lifeStats.shield>0){
                this._data.lifeStats.shield--
            }else{
                if (this._data.lifeStats.health>0){
                    this._data.lifeStats.health--
                }
            }
        }
        await this.save()
    }

    //--------------------------//
    //---------Ressources-------//
    //--------------------------//

    public async loadResources(foundArray:Array<databaseResource>){
       for (var i in foundArray){
            var found = foundArray[i]
            if (found){
                var r = new Resource(found.resource_id)
                r.owner = found.owner
                r.databaseId = found.id
                this.resources.push(r)
            }
        }
        /*if (foundArray.length == 0){
            this.addInInventory("cailloux")
        }*/
    }
    public async removeIndexInResources(index:number){
       var resourceRemove = this.resources.splice(index,1)
       console.log("HEY")
       console.log(resourceRemove[0])
       await Database.resourceDatabase.deleteOne({"id":resourceRemove[0].databaseId})
    }

    public async removeResourcesInResources(resources:Array<Resource>){
        for (var i in resources){
            await this.removeIndexInResources(this.resources.findIndex(r=>r.databaseId== resources[i].databaseId))
        }
    }

    public async addInResources(resource:string):Promise<Resource>{
        var id = Date.now().toString();
        var newResource = new Resource(resource)
        newResource.owner = this.id
        newResource.databaseId = id
        this.resources.push(newResource)
        await Database.resourceDatabase.insertOne({"id":newResource.databaseId,"owner":this.id,"resource_id":resource})
        return newResource
    }

    public async loadCookedFood(foundArray:Array<databaseCookedFood>){
        for (var i in foundArray){
            var found = foundArray[i]
            if (found){
                var r = new CookedFood(found.cookedfood_id)
                r.owner = found.owner
                r.databaseId = found.id
                var resourcesUsed = []
                for (var j in found.resources){
                    resourcesUsed.push(new Resource(found.resources[j]))
                }
                r.resources = resourcesUsed
                this.cookedFoods.push(r)
            }
        }
        /*if (foundArray.length == 0){
            this.addInInventory("cailloux")
        }*/
    }

    public async addInCookedFood(cookedfood:string,resourcesUsed:Array<Resource>):Promise<CookedFood>{
        var id = Date.now().toString();
        var newCookedFood = new CookedFood(cookedfood)
        newCookedFood.owner = this.id
        newCookedFood.databaseId = id
        newCookedFood.resources = resourcesUsed
        var databaseResources = []
        for (var i in resourcesUsed){
            databaseResources.push(resourcesUsed[i].id)
        }
        this.cookedFoods.push(newCookedFood)
        await Database.cookedFoodDatabase.insertOne({"id":newCookedFood.databaseId,"owner":this.id,"cookedfood_id":cookedfood,"resources":databaseResources})
        return newCookedFood
    }

    public async removeInCookedFood(index:number){
        var cookedFood = this.cookedFoods.splice(index,1)
        await Database.cookedFoodDatabase.deleteOne({"id":cookedFood[0].databaseId})
    }
    //--------------------------//
    //---------Cooldown---------//
    //--------------------------//
    public async addCooldown(type:cooldownType,seconds:number){
        if (this._cooldowns.find(c=>c.type==type)){
            if (this._cooldowns.find(c=>c.type==type && c.endTime>Date.now())){
                this._cooldowns.find(c=>c.type==type && c.endTime>Date.now()).endTime+=seconds*1000
            }else{
                this._cooldowns.find(c=>c.type==type).endTime = Date.now()+seconds*1000
            }
        }else{
            this._cooldowns.push({"type":type,"endTime":Date.now()+seconds*1000,player:this.id})
        }
        if (await Database.playerCooldownDatabase.findOne({"type":type,"player":this.id})){
            await Database.playerCooldownDatabase.updateOne({"type":type,"player":this.id},{"$set":{endTime:this._cooldowns.find(c=>c.type==type).endTime}})
        }else{
            await Database.playerCooldownDatabase.insertOne({"type":type,"endTime":Date.now()+seconds*1000,player:this.id})
        }
        return
    }

    public async addShield(seconds:number){
        if (this._cooldowns.find(c=>c.type=="SHIELD")){
            if (this._cooldowns.find(c=>c.type=="SHIELD" && c.endTime>Date.now())){
                this._cooldowns.find(c=>c.type=="SHIELD" && c.endTime>Date.now()).endTime+=seconds*1000
            }else{
                this._cooldowns.find(c=>c.type=="SHIELD").endTime = Date.now()+seconds*1000
            }
        }else{
            this._cooldowns.push({"type":"SHIELD","endTime":Date.now()+seconds*1000,player:this.id})
        }
        if (await Database.playerCooldownDatabase.findOne({"type":"SHIELD","player":this.id})){
            await Database.playerCooldownDatabase.updateOne({"type":"SHIELD","player":this.id},{"$set":{endTime:this._cooldowns.find(c=>c.type=="SHIELD").endTime}})
        }else{
            await Database.playerCooldownDatabase.insertOne({"type":"SHIELD","endTime":Date.now()+seconds*1000,player:this.id})
        }
    }

    public hasCooldown(type:cooldownType):{ result: boolean; end: number; }{
        if (this.cooldowns.find(c=>c.type==type && c.endTime>Date.now())){
            return {result:true,end:this.cooldowns.find(c=>c.type==type && c.endTime>Date.now()).endTime}
        }else{
            return {result:false,end:-1}
        }
    }

    public isAttackable():{ result: boolean; reason: string; end: number; }{
        if (this.cooldowns.find(c=>c.type=="SHIELD" && c.endTime>Date.now())){
            return {result:false,reason:"Bouclier d'attaque",end:this.cooldowns.find(c=>c.type=="SHIELD" && c.endTime>Date.now()).endTime}
        }else{
            return {result:true, reason:"",end:-1}
        }
    }

    public async removeShield():Promise<boolean>{
        if (this.cooldowns.find(c=>c.type=="SHIELD" && c.endTime>Date.now())){
            this.cooldowns.splice(this.cooldowns.findIndex(c=>c.type=="SHIELD" && c.endTime>Date.now()),1)
            await Database.playerCooldownDatabase.deleteOne({"type":"SHIELD","player":this.id})
            return true
        }else{
            return false
        }
    }
    //--------------------------//
    //--------Mort joueur-------//
    //--------------------------//

    public checkIfDead(killer:Player):boolean{
        if (this.data.lifeStats.health <= 0 && !this.data.dead){
            this.data.dead = true
            this.sendMp(EmbedConstructor.dead(killer,Math.floor(this.data.coins*0.20)))
            this.giveDeathPrize()
            this.data.movement = undefined
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

    //--------------------------//
    //---------Sauvegardes------//
    //--------------------------//

    public async save():Promise<void>{
        if (await Database.playerDatabase.findOne({"id":this.id})){
            await Database.playerDatabase.updateOne({"id":this.id},{"$set":this._data})
        }else{
            await Database.playerDatabase.insertOne(this._data)
        }
    }

    //--------------------------//
    //-----------Divers---------//
    //--------------------------//

    public async addLifePoint(life:{"health":number,shield:number}){
        this.data.lifeStats.health+=life.health;
        this.data.lifeStats.shield+=life.shield;
        if (this.data.lifeStats.health>100){
            this.data.lifeStats.health = 100
        }
        if (this.data.lifeStats.shield>100){
            this.data.lifeStats.shield = 100
        }
        this.save()
    }

    public async loadEffects(foundArray:Array<playerEffect>){
        for (var i in foundArray){
            var found = foundArray[i]
            if (found){
                var e = new PlayerEffect(found)
                e.owner = found.owner
                e.databaseId = found.id
                this.effects.push(e)
            }
        }
    }

    //C'est PlayerEffect.ts qui met dans la bdd
    public async addEffect(effect:PlayerEffect){
        this.effects.push(effect)
        EffectsManager.effects.push({"effect_type":effect.effect_type,"owner":effect.owner,"end_time":effect.end_time,"id":effect.databaseId,"power":effect.power,"start_time":effect.start_time})
        //await Database.playerEffectDatabase.insertOne(effect.toObject())
        
    }

    public async removeEffect(effect:PlayerEffect){
        
    }

    //--------------------------//
    //--------Textes------------//
    //--------------------------//
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
        if (this.data.lifeStats.shield>=100){
            finalShield+="<:EndingShield:840541109188821012>"
        }else{
            finalShield+="<:EmptyEndingShield:840547994319585332>"
        }
        return {"health":finalHealth,"shield":finalShield}
    }

    public getLeagueText():string{
        var medals = this.data.medals?this.data.medals:0
        var league:league = leagues[0]
        for (var i in leagues){
            if (medals>=leagues[i].minimum_medals){
                league = leagues[i]
            }else{
                break
            }
        }
        return league.name.fr+" ("+medals+" médailles)"
    }

    public setRandomPosition(){
        this.data.position = {"x":Math.floor(Math.random()*3000-1500),"y":Math.floor(Math.random()*3000-1500)}
        this.save()
    }

    public getRandomPositionAround(){
        var x = Math.floor(Math.random()*Player.visibilityRadius*1.5)-(Math.floor(Player.visibilityRadius*0.75))
        var y = Math.floor(Math.random()*Player.visibilityRadius*1.5)-(Math.floor(Player.visibilityRadius*0.75))
        var pos = {x:this.getRealPosition().x+x,y:this.getRealPosition().y+y}
        return pos
    }

    public async addServer(id:string){
        if (Cache.playersInServer.has(id)){
            if (Cache.playersInServer.get(id).find(p=>p==this.id)){
                return
            }else{
                await Database.playerServerDatabase.insertOne({"server":id,"player":this.id})
                Cache.playersInServer.get(id).push(this.id)
            }
        }else{
            await Database.playerServerDatabase.insertOne({"server":id,"player":this.id})
            Cache.playersInServer.set(id,[this.id])
        }
        //    Cache.playersInServer.find(p=>p.id==id).players.push(this)
        /*if (await Database.playerServerDatabase.findOne({"server":id,"player":this.id})){
        }else{
            
        }*/
    }

    public getTimeLeft():string{
        if (!this.data.movement) return "<t:"+(Date.now()/1000)+":R>"
        var distanceFinale = Math.sqrt(Math.pow(this.data.position.x-this.data.movement.position.x,2)+Math.pow(this.data.position.y-this.data.movement.position.y,2))*Player.rapidity
        
        return "<t:"+(Math.floor(Date.now()/1000)+Math.floor(distanceFinale)-Math.floor((Date.now()-this.data.movement.start)/1000))+":R>"
    }

    public getDistance(pos:position):number{
        var distanceFinale = Math.sqrt(Math.pow(this.getRealPosition().x-pos.x,2)+Math.pow(this.getRealPosition().y-pos.y,2))
        return distanceFinale
    }

    public getRealPosition():position{
        if (!this.data.movement){
            return this.data.position
        }
        if (this.data.movement.position.x==this.data.position.x && this.data.position.y==this.data.movement.position.y){
            this.data.movement = undefined
            return this.data.position
        }
        var distanceFinale = Math.sqrt(Math.pow(this.data.position.x-this.data.movement.position.x,2)+Math.pow(this.data.position.y-this.data.movement.position.y,2))
        var timeSinceBeginning = 0
        var currentEffects = this.effects.filter(e=>e.effect_type=="SPEED" && e.end_time>this.data.movement.start)
        currentEffects.sort((a,b)=>{
            if (a.start_time>b.start_time){
                return 1
            }else{
                return -1
            }
        })
        for (let i = 0;i<currentEffects.length;i++){
            currentEffects[i].variable_start_time = currentEffects[i].start_time
            currentEffects[i].variable_end_time = currentEffects[i].end_time
            if (currentEffects[i].variable_start_time<this.data.movement.start){
                currentEffects[i].variable_start_time = this.data.movement.start
            }
            if (currentEffects[i].variable_end_time>Date.now()){
                currentEffects[i].variable_end_time = Date.now()
            }
            timeSinceBeginning+=(currentEffects[i].variable_end_time-currentEffects[i].variable_start_time)*currentEffects[i].power
            if (i+1!=currentEffects.length){
                timeSinceBeginning+=(currentEffects[i+1].variable_start_time-currentEffects[i].variable_end_time)*1
            }
        }
        if (currentEffects.length>0){
            timeSinceBeginning+=(Date.now()-currentEffects[currentEffects.length-1].variable_end_time)
            timeSinceBeginning+=currentEffects[0].variable_start_time-this.data.movement.start
        }else{
            timeSinceBeginning+=Date.now()-this.data.movement.start
        }
        timeSinceBeginning/=1000
        if (timeSinceBeginning>=distanceFinale*Player.rapidity){
            this.data.position = this.data.movement.position
            this.data.movement = undefined
            this.save()
            return this.data.position
        }
        var finalX = 0
        var finalY = 0

        var thisFinalX = this.data.movement.position.x-this.data.position.x
        finalX = timeSinceBeginning*thisFinalX/(distanceFinale*Player.rapidity) + this.data.position.x
        
        var thisFinalY = this.data.movement.position.y-this.data.position.y
        finalY = timeSinceBeginning*thisFinalY/(distanceFinale*Player.rapidity) + this.data.position.y
        return {x:Math.round(finalX),y:Math.round(finalY)}
    }

    public get box(): Array<Box> {
        return this._box;
    }
    public set box(value: Array<Box>) {
        this._box = value;
    }
    public async sendMp(message:string|MessageEmbed){
        if (message instanceof MessageEmbed){
            this._discordUser.send({embeds:[message]})
        }else{
            this._discordUser.send(message)
        }
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



    
    public get lastChannel(): TextChannel|ThreadChannel{
        return this._lastChannel;
    }
    public set lastChannel(value: TextChannel|ThreadChannel) {
        this._lastChannel = value;
    }

    public get cooldowns(): Array<cooldown> {
        return this._cooldowns;
    }
    public set cooldowns(value: Array<cooldown>) {
        this._cooldowns = value;
    }

    
    public get resources(): Array<Resource> {
        return this._resources;
    }
    public set resources(value: Array<Resource>) {
        this._resources = value;
    }
    public get cookedFoods(): Array<CookedFood> {
        return this._cookedFoods;
    }
    public set cookedFoods(value: Array<CookedFood>) {
        this._cookedFoods = value;
    }
    
    public get effects(): Array<PlayerEffect> {
        return this._effects;
    }
    public set effects(value: Array<PlayerEffect>) {
        this._effects = value;
    }
    
    public get clanPlayer(): ClanPlayer {
        return this._clanPlayer;
    }
    public set clanPlayer(value: ClanPlayer) {
        this._clanPlayer = value;
    }
}