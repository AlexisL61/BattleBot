type databasePlayer = {
    id:string,
    coins:number,
    lifeStats:{
        health:number,
        shield:number,
    },
    dead:boolean
}

var _playerDefault:databasePlayer= {
    id:"",
    coins:1000,
    lifeStats:{
        health:100,
        shield:0,
    },
    dead:false
}

export default databasePlayer
export {_playerDefault}