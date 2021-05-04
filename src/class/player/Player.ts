import { User } from "discord.js";
import databasePlayer from "../../types/database/player";
import Weapon from "../weapon/Weapon";


export default class Player {
    private _id: string;
    private _discordUser: User;
    private _data: databasePlayer;
    private inventory:Array<Weapon>;

    /**
     * Représente un joueur sur BattleBot
     * @param $discordUser Utilisateur discord
     * @param $data Données utilisateur dans la bdd
     */
	constructor($discordUser: User, $data:databasePlayer) {
        this.id = $discordUser.id
		this.discordUser = $discordUser;
        this.data = $data;
	}

    public checkIfDead(){
        if (this.data.lifeStats.health == 0){
            
        }
    }

    public get discordUser(): User {
        return this._discordUser;
    }
    public set discordUser(value: User) {
        this._discordUser = value;
    }
    
    public get data(): databasePlayer {
        return this._data;
    }
    public set data(value: databasePlayer) {
        this._data = value;
    }

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
}