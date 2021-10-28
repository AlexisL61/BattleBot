import weaponType from "../types/weaponType";
import Damage from "../class/effect/effects/Damage";
import Healing from "../class/effect/effects/Healing";
import { MessageMentions } from "discord.js";
import Mention from "../class/effect/effects/Mention";
import Group from "../class/effect/effects/Group";

var weapons:Array<weaponType> = 
[
    {"id":"cailloux","name":{"fr":"cailloux","en":"cailloux"},"image":"","emoji":"🪨","effect":new Mention({"child":(new Damage({"damage":7,"mention":"nearestMention","miss":10,"critical":5})),"toMention":"La personne à attaquer"}),"rarity":"common"},
    {"id":"cailloux_launcher","name":{"fr":"lanceur de cailloux","en":"cailloux launcher"},"image":"","emoji":"🪨🪨🪨","effect":new Mention({"child":(new Group({"children":[new Damage({"damage":7,"mention":"nearestMention","miss":10,"critical":5}),new Damage({"damage":7,"mention":"nearestMention","miss":10,"critical":5}),new Damage({"damage":7,"mention":"nearestMention","miss":10,"critical":5})],groupTarget:"SAME_TARGET"})),"toMention":"La personne à attaquer"}),"rarity":"common"},
    {"id":"arc","name":{"fr":"arc","en":"bow"},"image":"","emoji":"🏹","effect":new Mention({"child":(new Group({"children":[new Damage({"damage":20,"mention":"nearestMention","miss":7,"critical":5})],"groupTarget":"SAME_TARGET"})),"toMention":"La personne à attaquer"}),"rarity":"uncommon"},
    {"id":"lance","name":{"fr":"lance","en":"lance"},"image":"","emoji":"","effect":new Mention({"child":(new Group({"children":[new Damage({"damage":25,"mention":"nearestMention","miss":15,"critical":10})],"groupTarget":"SAME_TARGET"})),"toMention":"La personne à attaquer"}),"rarity":"uncommon"},
    {"id":"bandage","name":{"fr":"bandage","en":"bandage"},"image":"","emoji":":heart:","effect":new Healing({"mention":"user","health":10,"shield":0}),"rarity":"common"},
    {"id":"health_kit","name":{"fr":"kit de soin","en":"health kit"},"image":"","emoji":":heart:","effect":new Healing({"mention":"user","health":50,"shield":0}),"rarity":"uncommon"}
]

export {weapons}