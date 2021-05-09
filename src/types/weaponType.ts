import Effect from "../class/effect/Effect";
import mention from "./mentions";

type weaponType = {
    id:string,
    name:{"fr":string,"en":string},
    image:string,
    emoji:string,
    effect:Effect,
    rarity:"common"
}

export default weaponType