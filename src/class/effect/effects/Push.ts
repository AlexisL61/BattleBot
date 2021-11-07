import useEffect from "../../../types/useEffect";
import Player from "../../player/Player";
import Effect from "../Effect";

//Create class extends effect
export default class Push extends Effect {
    private point:"ATTACKER"
    private puissance:number;
    
    constructor(data:pushType) {
        super("Push","nearestMention");
        this.puissance=data.puissance;
        this.point=data.point;
    }

    public toString(): string {
        return ("Repousse une cible");
    }
    public async applyEffect(player: Player, target: Player, mentions: string[]): Promise<useEffect> {
        if (this.mentionTarget == "user"){
            target = player
        }
        if (this.point == "ATTACKER"){
            var differencesPosition = {"x":player.getRealPosition().x-target.getRealPosition().x,"y":player.getRealPosition().y-target.getRealPosition().y};
            var differencesNumber = player.getDistance(target.getRealPosition());
            differencesPosition = {"x":differencesPosition.x/differencesNumber,"y":differencesPosition.y/differencesNumber};
            differencesNumber = Player.visibilityRadius-differencesNumber;
            differencesPosition = {"x":differencesPosition.x*differencesNumber*this.puissance,"y":differencesPosition.y*differencesNumber*this.puissance};
            target.data.position = ({"x":Math.round(target.getRealPosition().x-differencesPosition.x),"y":Math.round(target.getRealPosition().y-differencesPosition.y)});
            if (target.data.movement){
                target.data.movement.start=Date.now();
            }
            await target.save();
            return {"success":true,"data":{"message":"🌬️ "+target.discordUser.tag+" s'est fait pousser","playersTargeted":[{player:target}]}}
        }
    }

}