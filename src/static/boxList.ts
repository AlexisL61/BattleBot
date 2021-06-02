import weaponType from "../types/weaponType";
import Damage from "../class/effect/effects/Damage";
import Healing from "../class/effect/effects/Healing";
import { MessageMentions } from "discord.js";
import Mention from "../class/effect/effects/Mention";
import boxType from "../types/boxType";

var boxes:Array<boxType> = 
[
    {"id":"common_box","name":{"fr":"Box commune","en":"Common box"},"image":"","emoji":"🎁"},
    {"id":"bandage","name":{"fr":"bandage","en":"bandage"},"image":"","emoji":":heart:"}
]

export {boxes}