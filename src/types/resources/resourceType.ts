import Effect from "../../class/effect/Effect";
import rarityType from "../rarityType";
import resourceBonus from "./resourceBonus";

type resourceType = {
    id:string,
    name:{"fr":string,"en":string},
    emoji:string,
    type:string,
    subtype:string,
    bonus:resourceBonus
    rarity:string
}

export default resourceType