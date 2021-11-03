import { APIEmoji, APIPartialEmoji } from "../node_modules/discord-api-types/v9"

export default class EmojiHelper{
    public static buildAPIEmoji(e:string):APIPartialEmoji{
        if (e.length==1)
            return {"id":e,"name":e}
        var data = e.replace(">","").replace("<","").split(":").splice(0,1)
        return {"id":data[1],"name":data[0]}
    }

    public static getEmojiId(e:string):string{
        if (e.length==1)
            return e
        var data = e.replace(">","").replace("<","").split(":").splice(0,1)
        return data[1]
    }
}