import useEffect from "../../../types/useEffect";
import Player from "../../player/Player";
import Effect from "../Effect";

//Create class extends effect
export default class Comment extends Effect {
    private text:string
    
    constructor(data:commentType) {
        super("Comment","nearestMention");
        this.text = data.text;
    }

    public toString(): string {
        return ("");
    }
    public async applyEffect(player: Player, target: Player, mentions: string[]): Promise<useEffect> {
        return {"success":true,"data":{"message":this.text,"playersTargeted":[]}}
    }

}