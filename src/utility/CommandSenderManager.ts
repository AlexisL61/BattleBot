import { MessagePayload,MessageOptions, Message } from "discord.js";
import commandSender from "../types/commandSender";


export default class CommandSenderManager {
    public static async reply(c:commandSender,d:string|MessagePayload|MessageOptions):Promise<Message>{
        if (c.type=="MESSAGE"){
            return await c.message.channel.send(d)
        }else{
            if (c.interaction.isCommand()){
                if (c.interaction.replied){
                    await c.interaction.followUp(d)
                }else{
                    await c.interaction.editReply(d)
                }
                var fetch = await c.interaction.fetchReply()
                if (fetch instanceof Message){
                    return fetch
                }
            }
        }
    }
}