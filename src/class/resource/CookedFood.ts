import recipes from "../../static/recipeList";
import recipe from "../../types/resources/recipe";
import resourceBonus from "../../types/resources/resourceBonus";
import Database from "../database/Database";

export default class CookedFood{

    private _id: string;
    private _name: { "fr": string; "en": string; };
    private _emoji: string;
    private _bonus: resourceBonus;
    private _databaseId: string;
    private _owner: string;

    constructor(id:string){
        var found = CookedFood.getCookedFoodData(id)
        if (found){
            var r = found;
            console.log("RESSOURCE")
            console.log(r)
            this._id = r.id;
            this._name = r.name
            this._bonus = r.bonus
        }
    }

    public static getCookedFoodData(resourceId:string):recipe{
        if (recipes.find(w=>w.id==resourceId)){
            return recipes.find(w=>w.id==resourceId)
        }else{
            return undefined
        }
    }

    public static async getDatabaseResource(weaponId:string):Promise<CookedFood>{
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
}