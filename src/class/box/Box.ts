import fs from "fs";
import boxContent from "../../static/boxContent";
import { boxes } from "../../static/boxList";
import boxType from "../../types/boxType";
import databaseBox from "../../types/database/box"
import Cache from "../cache/Cache";
import Database from "../database/Database"
import Weapon from "../weapon/Weapon";

export default class Box {
    
    private _id: string;
    private _name: { "fr": string; "en": string; };
    private _emoji: string;
    private _image: string;
    private _databaseId: string;
    private _owner: string;

    constructor(id:string){
        var found = Box.getBoxData(id)
        if (found){
            var b = found
            this._id = b.id
            this.name = b.name
            this.emoji = b.emoji
            this.image = b.image
        }
    }

    public async open():Promise<Weapon>{
        var boxInside:Array<{type:string,id:string,multiplicity?:number}> = boxContent[this.id]
        var items:Array<{type:string,id:string}> = []
        for (var item of boxInside){
            var multiplicity = item.multiplicity|1
            for (var i = 0;i<multiplicity;i++){
                items.push({"type":item.type,"id":item.id})
            }
        }
        var itemFound = items[Math.floor(Math.random()*items.length)]
        var currentOwner = await Cache.playerFind(this.owner)
        await currentOwner.removeInBox(currentOwner.box.findIndex(b=>b.id==this.id))
        return await currentOwner.addInInventory(itemFound.id)
    }

    public static getBoxData(boxId:string):boxType{
        if (boxes.find(b=>b.id==boxId)){
            return boxes.find(b=>b.id==boxId)
        }else{
            return undefined
        }
    }

    public static async getDatabaseBox(weaponId:string):Promise<Box>{
        var found:databaseBox =await Database.inventoryDatabase.findOne({"id":weaponId})
        if (found){
            var b = new Box(found.box_id)
            b.owner = found.owner
            b._databaseId = found.id
            return b
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
    public get image(): string {
        return this._image;
    }
    public set image(value: string) {
        this._image = value;
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