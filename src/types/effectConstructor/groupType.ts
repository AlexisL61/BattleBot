import Effect from "../../class/effect/Effect"

type groupType = {
    children:Array<Effect>,
    groupTarget:"SAME_TARGET"|"DIFFERENT_TARGET"
}

export default groupType