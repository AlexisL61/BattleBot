import Effect from "../../class/effect/Effect";
import rarityType from "../rarityType";
import resourceBonus from "./resourceBonus";

type resourceType = {
    id:string,
    name:{"fr":string,"en":string},
    emoji:string,
    types:Array<string>,
    bonus:resourceBonus
    rarity:string
}

export default resourceType