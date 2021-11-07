import playerEffects from "../../static/playerEffectList";
import recipes from "../../static/recipeList";
import recipe from "../../types/resources/recipe";
import resourceBonus from "../../types/resources/resourceBonus";
import Database from "../database/Database";
import Player from "../player/Player";
import Resource from "./Resource";

export default class CookedFood{

    private _id: string;
    private _name: { "fr": string; "en": string; };
    private _emoji: string;
    private _bonus: resourceBonus;
    private _databaseId: string;
    private _owner: string;
    private _resources: Array<Resource>;

    constructor(id:string){
        var found = CookedFood.getCookedFoodData(id)
        if (found){
            var r = found;
            console.log("RESSOURCE")
            console.log(r)
            this._id = r.id;
            this._name = r.name
            this._bonus = r.bonus
            this._emoji = r.emoji
        }
    }

    public getHealingBonus():string{
        var health = this.bonus.health
        var shield = this.bonus.shield
        for (var i in this.resources){
            health+=this.resources[i].bonus.health
            shield+=this.resources[i].bonus.shield
        }
        var bonus = ""
        if (this.bonus.effects.length>=1){
            bonus+="\n"
        }
        for (var i in this.bonus.effects){
            var thisAvailableEffect = playerEffects.find(f=>f.id==this.bonus.effects[i].effect_type)
            bonus+="-> "+thisAvailableEffect.toString(this.bonus.effects[i].duration,this.bonus.effects[i].power)+"\n"
        }
        return health+" ❤️ | "+shield+" 🛡️"
    }

    public getEffects():string{
        var bonus = ""
        if (this.bonus.effects.length>=1){
            bonus+="\n"
        }
        for (var i in this.bonus.effects){
            var thisAvailableEffect = playerEffects.find(f=>f.id==this.bonus.effects[i].effect_type)
            bonus+="-> "+thisAvailableEffect.toString(this.bonus.effects[i].duration,this.bonus.effects[i].power)+"\n"
        }
        return bonus
    }

    public getHealth():number{
        var health = this.bonus.health
        for (var i in this.resources){
            health+=this.resources[i].bonus.health
        }
        return health
    }

    public getShield():number{
        var shield = this.bonus.shield
        for (var i in this.resources){
            shield+=this.resources[i].bonus.shield
        }
        return shield
    }

    public static getCookedFoodData(resourceId:string):recipe{
        if (recipes.find(w=>w.id==resourceId)){
            return recipes.find(w=>w.id==resourceId)
        }else{
            return undefined
        }
    }

    public static async getDatabaseCookedFood(weaponId:string):Promise<CookedFood>{
        var found:databaseCookedFood =await Database.resourceDatabase.findOne({"id":weaponId})
        if (found){
            var c = new CookedFood(found.cookedfood_id)
            c._owner = found.owner
            c._databaseId = found.id
            return c
        }else{
            return undefined
        }
    }

    public static async createFromResources(player:Player,resources:Array<Resource>):Promise<CookedFood>{
        var cookedFoodFound:CookedFood
        var cookedFoodPossible:Array<{id:string,points:number}>
        for (var i in recipes){
            var currentResources = resources.filter(f=>true)
            var available = true
            for (var j in recipes[i].need){
                if (currentResources.find(r=>r.types.find(t=>t==recipes[i].need[j]))){
                    currentResources.splice(currentResources.findIndex(r=>r.types.find(t=>t==recipes[i].need[j])),1)
                }else{
                    available=false
                    break
                }
            }
            if (available){
                var cookedFoodCreated = await player.addInCookedFood(recipes[i].id,resources)
                await player.removeResourcesInResources(resources)
                return cookedFoodCreated
            }
        }
        return null
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

    
    public get bonus(): resourceBonus {
        return this._bonus;
    }
    public set bonus(value: resourceBonus) {
        this._bonus = value;
    }

    
    public get databaseId(): string {
        return this._databaseId;
    }
    public set databaseId(value: string) {
        this._databaseId = value;
    }

    
    public get owner(): string {
        return this._owner;
    }
    public set owner(value: string) {
        this._owner = value;
    }
    public get resources(): Array<Resource> {
        return this._resources;
    }
    public set resources(value: Array<Resource>) {
        if (!this.bonus.effects){
            this.bonus.effects = []
        }
        this._resources = value;
        for (var i in value){
            for (var j in value[i].bonus.effects){
                this.bonus.effects.push(value[i].bonus.effects[j])
            }

        }
    }
}