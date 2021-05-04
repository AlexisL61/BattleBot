import useEffect from "../../types/useEffect";
import Player from "../player/Player";

export default abstract class Effect {
    private _type: string;
    private _mentionTarget: string;

    constructor(type:string,mentionTarget:string){
        this.type = type;
        this.mentionTarget = mentionTarget
    }

    public abstract toString():string

    public abstract applyEffect(player:Player):useEffect

    public get type(): string {
        return this._type;
    }
    public set type(value: string) {
        this._type = value;
    }

    public get mentionTarget(): string {
        return this._mentionTarget;
    }
    public set mentionTarget(value: string) {
        this._mentionTarget = value;
    }
} 