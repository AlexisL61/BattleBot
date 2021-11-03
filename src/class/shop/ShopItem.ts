import { boxes } from "../../static/boxList"
import boxType from "../../types/boxType"

export default class ShopItem {
    private item:{
        type:"box",
        id:string
    }
    private _price: number
    public get price(): number {
        return this._price
    }
    public set price(value: number) {
        this._price = value
    }
    private _dropTime: number
    public get dropTime(): number {
        return this._dropTime
    }
    public set dropTime(value: number) {
        this._dropTime = value
    }

    public static shop = [new ShopItem({type:"box",id:"common_box"},250,10),new ShopItem({type:"box",id:"uncommon_box"},1000,30)]

    constructor(item:{type:"box",id:string},price:number,dropTime:number){
        this.item = item
        this.price = price
        this.dropTime = dropTime
    }

    public getItemString():string{
        if (this.item.type=="box"){
            var thisBox = boxes.find(b=>b.id==this.item.id)
            return thisBox.emoji+" "+thisBox.name.fr
        }
    }

    public getItem():boxType{
        if (this.item.type=="box"){
            var thisBox = boxes.find(b=>b.id==this.item.id)
            return thisBox
        }
    }
}