import Effect from "../../class/effect/Effect";

type resourceGroupType = {
    foundableIn:Array<string>,
    resource:string,
    capacity:{min:number,max:number}
}

export default resourceGroupType