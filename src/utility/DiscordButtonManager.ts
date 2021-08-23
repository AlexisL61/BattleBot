import { Message } from "discord.js";
import axios from "axios";

export default class DiscordButtonManager{
    public static awaitButtonClicked(message:Message,timeout?:number):Promise<{status:number,data:{custom_id:string,component_type:2},token:string,id:string}>{
        return new Promise((resolve, reject) => {
            var thisListener = (json)=>{
                if (json.message.id == message.id){
                    message.client.ws.removeListener("INTERACTION_CREATE",thisListener)
                    resolve({"status":0,"data":json.data,"token":json.token,"id":json.id})
                }
            }
            if (timeout){
                setTimeout(()=>{resolve({"status":1,"data":undefined,"token":undefined,"id":undefined})},timeout)
            }
            message.client.ws.addListener("INTERACTION_CREATE",thisListener)
        });
    }

    public static respondToInteraction(interaction_id:string,interaction_token:string){
        axios.post("https://discord.com/api/v8/interactions/"+interaction_id+"/"+interaction_token+"/callback",{"type":6})
    }
}