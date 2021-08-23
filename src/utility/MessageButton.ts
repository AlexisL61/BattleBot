import { APIMessage, Channel, Message, MessageTarget } from "discord.js";

export default class MessageButton extends APIMessage {
    private buttons:Array<object> = []

    constructor(message:string,channel:MessageTarget){
        super(channel,{})
        this.data = {}
        this.data["content"] = message
        this.data["components"] = [{
            type:1,
            components:[]
        }]
    }
    
    public addButton(label:string,style:number,custom_id:string,disabled?:boolean){
        this.data["components"][0]["components"].push({label:label,style:style,type:2,custom_id:custom_id,disabled:!disabled?false:true})
    }

    public setEmbed(embed:object){
        this.data["embed"] = embed
    }
}