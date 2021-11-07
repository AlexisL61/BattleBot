import weaponType from "../types/weaponType";
import Damage from "../class/effect/effects/Damage";
import Healing from "../class/effect/effects/Healing";
import { MessageMentions } from "discord.js";
import Mention from "../class/effect/effects/Mention";
import Group from "../class/effect/effects/Group";
import Push from "../class/effect/effects/Push";
import Comment from "../class/effect/effects/Comment";

var weapons:Array<weaponType> = 
[
    {
        id: "cailloux",
        name: { fr: "cailloux", en: "cailloux" },
        image: "",
        emoji: "🪨",
        effect: new Mention({
            child: new Group({
                children: [
                    new Comment({ text: "Vous lancez votre cailloux..." }),
                    new Damage({
                        damage: 7,
                        mention: "nearestMention",
                        miss: 10,
                        critical: 5,
                    }),
                ],
                groupTarget: "SAME_TARGET",
            }),
            toMention: "La personne à attaquer",
        }),
        rarity: "common",
        info: {
            description: "Un cailloux, tout ce qu'il y a de plus classique",
            use: "Lance votre cailloux\nInflige 7 dégats",
        },
    },
    {
        id: "mini_batte_baseball",
        name: { fr: "mini batte de baseball", en: "baseball" },
        image: "",
        emoji: "<:battedebaseball:905237237791358986>",
        effect: new Mention({
            child: new Group({
                children: [
                    new Damage({
                        damage: 3,
                        mention: "nearestMention",
                        miss: 8,
                        critical: 2,
                    }),
                    new Push({ point: "ATTACKER", puissance: 0.5 }),
                ],
                groupTarget: "SAME_TARGET",
            }),
            toMention: "La personne à attaquer",
        }),
        rarity: "common",
        info: {
            description: "Une batte de baseball",
            use: "Attaquez avec votre batte\nInflige 3 dégats\nRepousse un adversaire",
        },
    }, //Créateur flaticons
    {
        id: "cailloux_launcher",
        name: { fr: "lanceur de cailloux", en: "cailloux launcher" },
        image: "",
        emoji: "🪨🪨🪨",
        effect: new Mention({
            child: new Group({
                children: [
                    new Comment({ text: "Vous lancez votre premier cailloux..." }),
                    new Damage({
                        damage: 7,
                        mention: "nearestMention",
                        miss: 10,
                        critical: 5,
                    }),
                    new Comment({ text: "Ensuite votre second cailloux..." }),
                    new Damage({
                        damage: 7,
                        mention: "nearestMention",
                        miss: 10,
                        critical: 5,
                    }),
                    new Comment({ text: "Et enfin votre ultime cailloux..." }),
                    new Damage({
                        damage: 7,
                        mention: "nearestMention",
                        miss: 10,
                        critical: 5,
                    }),
                ],
                groupTarget: "SAME_TARGET",
            }),
            toMention: "La personne à attaquer",
        }),
        rarity: "uncommon",
        info: {
            description:
            "Qu'est ce qui est mieux qu'un cailloux ? Un lanceur de cailloux bien sûr",
            use: "Lance 3 cailloux à la suite\nInflige 7 dégâts x 3",
        },
    },
    {
        id: "arc",
        name: { fr: "arc", en: "bow" },
        image: "",
        emoji: "🏹",
        effect: new Mention({
            child: new Group({
                children: [
                    new Damage({
                        damage: 20,
                        mention: "nearestMention",
                        miss: 7,
                        critical: 5,
                    }),
                ],
                groupTarget: "SAME_TARGET",
            }),
            toMention: "La personne à attaquer",
        }),
        rarity: "uncommon",
        info: {
            description: "Un arc équipé d'une flèche pour attaquer",
            use: "Tir à l'arc\nInflige 20 dégâts",
        },
    },
    {
        id: "lance",
        name: { fr: "lance", en: "lance" },
        image: "",
        emoji: "",
        effect: new Mention({
            child: new Group({
                children: [
                    new Damage({
                        damage: 25,
                        mention: "nearestMention",
                        miss: 15,
                        critical: 10,
                    }),
                ],
                groupTarget: "SAME_TARGET",
            }),
            toMention: "La personne à attaquer",
        }),
        rarity: "uncommon",
        info: {
            description: "Une lance acérée capable d'abatre n'importe quel ennemi",
            use: "Lancez votre lance\nInflige 25 dégâts\n(Chance de coup raté accrue)",
        },
    },
    {
        id: "batte_baseball",
        name: { fr: "batte de baseball", en: "baseball" },
        image: "",
        emoji: "<:battedebaseball:905237237791358986>",
        effect: new Mention({
            child: new Group({
                children: [
                    new Comment({ text: "Vous chargez votre attaque..." }),
                    new Damage({
                        damage: 6,
                        mention: "nearestMention",
                        miss: 4,
                        critical: 2,
                    }),
                    new Push({ point: "ATTACKER", puissance: 1 }),
                    new Comment({ text: "HOME RUN !" }),
                ],
                groupTarget: "SAME_TARGET",
            }),
            toMention: "La personne à attaquer",
        }),
        rarity: "uncommon",
        info: {
            description: "Une batte de baseball",
            use: "Attaquez avec votre batte\nInflige 6 dégats\nRepousse un adversaire",
        },
    }, //Créateur flaticons
    {
        id: "bandage",
        name: { fr: "bandage", en: "bandage" },
        image: "",
        emoji: ":heart:",
        effect: new Healing({ mention: "user", health: 10, shield: 0 }),
        rarity: "common",
        info: { description: "bandage", use: "bandage" },
    },
    {
        id: "health_kit",
        name: { fr: "kit de soin", en: "health kit" },
        image: "",
        emoji: ":heart:",
        effect: new Healing({ mention: "user", health: 50, shield: 0 }),
        rarity: "uncommon",
        info: { description: "kit", use: "kit" },
    },
];

export {weapons}