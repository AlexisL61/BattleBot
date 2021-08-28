import damageType from "../../../types/effectConstructor/damageType";
import useEffect from "../../../types/useEffect";
import Player from "../../player/Player";
import Effect from "../Effect";

export default class Damage extends Effect{

    private damage:number;
    private missPercent:number;
    private criticalPercent:number;
    private criticalRatio:number = 1.5;

    constructor(data:damageType){
        super("Damage",data.mention)
        this.damage = data.damage
        this.missPercent = data.miss
        this.criticalPercent = data.critical
        if (data.criticalRatio){
            this.criticalRatio = data.criticalRatio
        }
    }

    public toString(): string {
        return "Inflige "+this.damage+" dégats"
    }

    public async applyEffect(player: Player, target:Player,mentions:Array<string>): Promise<useEffect> {
        if (this.mentionTarget == "user"){
            target = player
        }
        var randomNumber = Math.random()*100
        var status = "damage"
        await target.addShield(this.damage*60)
        if (randomNumber<this.missPercent){
            status = "miss"
            return {"success":true,"data":{"message":"💥 *0 dégâts effectués* sur "+target.discordUser.tag+" (attaque ratée)","dead":false}}
        }
        if (randomNumber>100-this.criticalPercent){
            status="critical"
            target.infligeDegats(Math.round(this.damage*this.criticalRatio))
            await player.addAttackDone(target.id,Math.round(this.damage*this.criticalRatio))
            return {"success":true,"data":{"message":"💥 **"+Math.round(this.damage*this.criticalRatio)+" dégâts effectués** sur "+target.discordUser.tag+" (coup critique!)","dead":target.checkIfDead(player)}}
        }
        target.infligeDegats(this.damage)
        await player.addAttackDone(target.id,Math.round(this.damage))
        return {"success":true,"data":{"message":"💥 "+Math.round(this.damage)+" dégâts effectués sur "+target.discordUser.tag,"dead":target.checkIfDead(player)}}
    }
    
}