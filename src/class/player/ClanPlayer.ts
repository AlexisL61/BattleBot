import { User } from "discord.js";
import databasePlayer, { databaseClanPlayer } from "../../types/database/player";
import Clan from "../clan/Clan";
import Player from "./Player";

export default class ClanPlayer{
    private _clan: Clan;
    private _role: string;
    

    constructor($clanPlayer:databaseClanPlayer, $clan:Clan){
        this._role = $clanPlayer.role
        this._clan = $clan
	}
    
    public get role(): string {
        return this._role;
    }
    public set role(value: string) {
        this._role = value;
    }
    public get clan(): Clan {
        return this._clan;
    }
    public set clan(value: Clan) {
        this._clan = value;
    }
}