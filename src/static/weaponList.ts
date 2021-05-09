import weaponType from "../types/weaponType";
import Damage from "../class/effect/effects/Damage";
import Healing from "../class/effect/effects/Healing";
import { MessageMentions } from "discord.js";
import Mention from "../class/effect/effects/Mention";

var weapons:Array<weaponType> = 
[
    {"id":"cailloux","name":{"fr":"cailloux","en":"cailloux"},"image":"","emoji":"🪨","effect":new Mention({"child":(new Damage({"damage":10,"mention":"nearestMention","miss":3,"critical":3})),"toMention":"La personne à attaquer"}),"rarity":"common"},
    {"id":"bandage","name":{"fr":"bandage","en":"bandage"},"image":"","emoji":":heart:","effect":new Healing({"mention":"user","health":10,"shield":10}),"rarity":"common"}
]

export {weapons}