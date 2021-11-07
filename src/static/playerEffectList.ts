type playerEffectInList = {
    id:string,
    toString:(duration:number,power:number)=>string,
};
var playerEffects:Array<playerEffectInList> = [
    {"id":"SPEED","toString":(duration:number,power:number)=>{return "Rapidité: x"+power+" pour "+duration+" secondes";}},
    {"id":"FIRE","toString":(duration:number,power:number)=>{return "En feu: "+power+" de dégâts par minutes ("+duration+" secondes restantes)";}},
]

export default playerEffects;