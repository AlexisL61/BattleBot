import { rarities } from "../../static/rarityList";
import { resources, resourcesGroups, resourcesRarityChances } from "../../static/resourceList";
import rarityType from "../../types/rarityType";
import resourceBonus from "../../types/resources/resourceBonus";
import resourceGroupType from "../../types/resources/resourceGroupType";
import resourceType from "../../types/resources/resourceType";
import Database from "../database/Database";
import Effect from "../effect/Effect";


export default class Resource {
    private _id: string;
    private _name: { "fr": string; "en": string; };
    private _emoji: string;
    private _bonus: resourceBonus;
    private _rarity: rarityType;
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

    public static generateResourcesFromLocationType(location:"forest"|"plaine"|"montagne"|"river"):Array<resourceGroupType>{
        var finalResources:Array<resourceGroupType> = []
        var resourcesAvailable:Array<resourceGroupType> = []
        for (var r in resourcesGroups){
            if (resourcesGroups[r].foundableIn.find(l=>l==location)){
                for (var j = 0;j<resourcesRarityChances[resources.find(re=>re.id==resourcesGroups[r].resource).rarity];j++){
                    resourcesAvailable.push(resourcesGroups[r])
                }
            }
        }
        for (var i = 0; i<3;i++){
            finalResources.push(resourcesAvailable[Math.floor(Math.random()*resourcesAvailable.length)])
        }
        return finalResources
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
    public get rarity(): rarityType {
        return this._rarity;
    }
    public set rarity(value: rarityType) {
        this._rarity = value;
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