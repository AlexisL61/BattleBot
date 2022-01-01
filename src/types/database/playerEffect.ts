type playerEffect = {
    id: string,
    effect_type:"SPEED"|"FIRE",
    power: number,
    start_time: number,
    end_time: number,
    owner:string
}

export default playerEffect