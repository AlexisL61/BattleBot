import position from "../position";

type drop = {
    timeAvailable:number,
    position:position,
    server:string,
    owner:{
        type:"PLAYER"|"SERVER",
        player?:string
    }
    id:string,
    content:Array<{
        type: "box"
        id: string
    }>
}

export default drop