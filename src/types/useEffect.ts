import Player from "../class/player/Player"

type useEffect = {
    "success":boolean,
    "data"?:{
        "message":string,
        "playersTargeted"?:Array<useEffectPlayersTargeted>
        "mentionsUsed"?:number
    }
}

export type useEffectPlayersTargeted = {
    player:Player
}

export default useEffect