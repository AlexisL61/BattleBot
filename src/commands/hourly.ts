import Cache from "../class/cache/Cache"
import commandSender from "../types/commandSender"
import CommandSenderManager from "../utility/CommandSenderManager"
import EmbedConstructor from "../utility/EmbedConstructor"


export = async function(data:commandSender){
    const userId = data.type=="MESSAGE"? data.message.author.id:data.interaction.user.id
    var thisPlayer = await Cache.playerFind(userId)
    if (thisPlayer.hasCooldown("HOURLY").result==false){
        await thisPlayer.addCooldown("HOURLY",60)
        var moneyGiven = Math.floor(Math.random()*1000)+500
        thisPlayer.data.coins+=moneyGiven
        await thisPlayer.save()
        await CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.hourlyGot(moneyGiven)]})
    }else{
        await CommandSenderManager.reply(data,{"embeds":[EmbedConstructor.hourlyCooldown()]})
    }
}