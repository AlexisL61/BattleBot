import { rarities } from "../../static/rarityList";
import { resources } from "../../static/resourceList";
import rarityType from "../../types/rarityType";
import resourceBonus from "../../types/resources/resourceBonus";
import resourceType from "../../types/resources/resourceType";
import Database from "../database/Database";
import Effect from "../effect/Effect";


export default class Resource {
    private _id: string;
    private _name: { "fr": string; "en": string; };
    private _emoji: string;
    private bonus:resourceBonus
    private rarity:rarityType
    private _databaseId: string;
    private _owner: string;

    constructor(id:string){
        var found = Resource.getResourceData(id)
        if (found){
            var r = found;
            this._id = r.id;
            this._name = r.name
            this._emoji = r.emoji
            this.bonus = r.bonus
            this.rarity = rarities.find(ra=>ra.id==r.rarity)
        }

    }

    public static async getDatabaseResource(weaponId:string):Promise<Resource>{
        var found:databaseResource =await Database.resourceDatabase.findOne({"id":weaponId})
        if (found){
            var r = new Resource(found.resource_id)
            r._owner = found.owner
            r._databaseId = found.id
            return r
        }else{
            return undefined
        }
    }

    public static getResourceData(resourceId:string):resourceType{
        if (resources.find(w=>w.id==resourceId)){
            return resources.find(w=>w.id==resourceId)
        }else{
            return undefined
        }
    }
}