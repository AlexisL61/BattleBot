import position from "../position"

type databasePlayer = {
    id:string,
    coins:number,
    lifeStats:{
        health:number,
        shield:number,
    },
    dead:boolean,
    position:{x:number,y:number},
    movement?:{position:position,start:number},
    medals?:number
}

var _playerDefault:databasePlayer= {
    id:"",
    coins:1000,
    lifeStats:{
        health:100,
        shield:0,
    },
    dead:false,
    position:undefined,
    medals:0
}

type databaseClanPlayer = {
    id:string,
    clan:string,
    role:string
}

export default databasePlayer
export {_playerDefault}
export {databaseClanPlayer}