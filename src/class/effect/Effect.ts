import useEffect from "../../types/useEffect";
import Player from "../player/Player";

export default abstract class Effect {
    private _type: string;
    private _mentionTarget: "user" | "nearestMention";

    constructor(type:string,mentionTarget:"user" | "nearestMention"){
        this.type = type;
        this.mentionTarget = mentionTarget
    }

    public abstract toString():string

    public abstract applyEffect(player:Player,target:Player):Promise<useEffect>

    public get type(): string {
        return this._type;
    }
    public set type(value: string) {
        this._type = value;
    }

    public get mentionTarget(): "user" | "nearestMention" {
        return this._mentionTarget;
    }
    public set mentionTarget(value: "user" | "nearestMention") {
        this._mentionTarget = value;
    }
} 