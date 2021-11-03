import Effect from "../class/effect/Effect";
import mention from "./mentions";

type boxType = {
    id:string,
    name:{"fr":string,"en":string},
    image:string,
    emoji:string,
    rarityChance:{common:number,uncommon:number,rare:number}
}

export default boxType