type databasePlayer = {
    id:string,
    coins:number,
    lifeStats:{
        health:number,
        shield:number,
    }
}

var _playerDefault:databasePlayer= {
    id:"",
    coins:0,
    lifeStats:{
        health:100,
        shield:0,
    }
}

export default databasePlayer
export {_playerDefault}