import commandSender from "../types/commandSender";

export= function(data:commandSender){
    data.message.channel.send("Hello")
}