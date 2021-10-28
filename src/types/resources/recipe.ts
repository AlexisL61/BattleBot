import resourceBonus from "./resourceBonus";

type recipe = {
    bonus:resourceBonus,
    need:Array<string>,
    id:string,
    name:{fr:string,en:string}
}

export default recipe