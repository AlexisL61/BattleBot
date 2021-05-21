import healingType from "../../../types/effectConstructor/healingType";
import useEffect from "../../../types/useEffect";
import Player from "../../player/Player";
import Effect from "../Effect";

export default class Healing extends Effect{

    private health:number;
    private shield:number;

    constructor(data:healingType){
        super("Healing",data.mention)
        this.health = data.health
        this.shield = data.shield
    }

    public toString(): string {
        return "Soigne "+this.health+"hp et "+this.shield+"bouclier"
    }

    public async applyEffect(player: Player, target:Player,mentions:Array<string>): Promise<useEffect> {
        if (this.mentionTarget == "user"){
            target = player
        }
        target.data.lifeStats.health+=this.health;
        target.data.lifeStats.shield+=this.shield;
        if (target.data.lifeStats.health>100){
            target.data.lifeStats.health = 100
        }
        if (target.data.lifeStats.shield>200){
            target.data.lifeStats.shield = 200
        }
        target.save()
        return {"success":true,"data":{"message":":heart: **Soin de "+this.health+" :heart: et de "+this.shield+" :shield:** pour "+target.discordUser.tag}}
    }
    
}