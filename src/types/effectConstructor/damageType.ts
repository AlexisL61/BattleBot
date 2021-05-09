type damageType = {
    damage:number,
    miss:number,
    critical:number,
    mention:"nearestMention"|"user",
    criticalRatio?:number
}

export default damageType