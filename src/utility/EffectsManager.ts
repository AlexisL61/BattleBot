import Database from "../class/database/Database"
import Cron from "node-cron"
import Cache from "../class/cache/Cache"


export default class EffectsManager {
    public static effects:Array<playerEffect> = []

    public static async launchEffects() {
        await Database.playerEffectDatabase.deleteMany({end_time: {$lt: Date.now()}})
        EffectsManager.effects = await Database.playerEffectDatabase.find({}).toArray()
        this.launchFire()
    }

    private static launchFire(){
        Cron.schedule('* * * * *',async ()=>{
            for (var i in this.effects){
                if (this.effects[i].effect_type == "FIRE" && this.effects[i].end_time > Date.now()){
                    let player = await Cache.playerFind(this.effects[i].owner)
                    if (player){
                        await player.infligeDegats(this.effects[i].power)
                        if (player.data.lifeStats.health <= 0){
                            player.data.lifeStats.health = 1
                        }
                        await player.save()
                    }                    
                }
            }
            this.effects = this.effects.filter(effect => effect.end_time > Date.now())
        })
    }
}