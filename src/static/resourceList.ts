import resourceGroupType from "../types/resources/resourceGroupType";
import resourceType from "../types/resources/resourceType";

var resources:Array<resourceType> = [
    {"id":"red_apple","emoji":"🍎","name":{fr:"Pomme rouge","en":" Red apple"},"types":["terre","fruit","apple"],"bonus":{health:3,shield:0,effects:[]},"rarity":"common"},
    {"id":"poire","emoji":"🍐","name":{fr:"Poire","en":"Poire"},"types":["terre","fruit","poire"],"bonus":{health:0,shield:5,effects:[]},"rarity":"uncommon"},
    {"id":"green_apple","emoji":"🍏","name":{fr:"Pomme verte","en":"Green apple"},"types":["terre","fruit","apple"],"bonus":{health:2,shield:0,effects:[]},"rarity":"common"},
    {"id":"crab","emoji":"🦀","name":{fr:"Crabe","en":"Crabe"},"types":["mer","crustace","crab"],"bonus":{health:0,shield:3,effects:[]},"rarity":"common"},
    {"id":"perche","emoji":"🐟","name":{fr:"Perche","en":"Perche"},"types":["mer","poisson","perche"],"bonus":{health:0,shield:7,effects:[]},"rarity":"uncommon"},
    {"id":"champignon","emoji":"🍄","name":{fr:"Champignon","en":"Champignon"},"types":["terre","champignon"],"bonus":{health:3,shield:3,effects:[]},"rarity":"uncommon"},
    {"id":"champignon_tempo","emoji":"🍄","name":{fr:"Champignon tempo","en":"Champignon tempo"},"types":["terre","champignon","tempo"],"bonus":{health:3,shield:3,effects:[{"duration":60*10,"effect_type":"SPEED",power:1.5}]},"rarity":"uncommon"},
    {"id":"banane","emoji":"🍌","name":{fr:"Banane","en":"Banane"},"types":["terre","fruit","banane"],"bonus":{health:4,shield:0,effects:[]},"rarity":"common"},
    {"id":"noix_de_coco","emoji":"🥥","name":{fr:"Noix de coco","en":"Noix de coco"},"types":["terre","fruit","noix_de_coco"],"bonus":{health:0,shield:12,effects:[]},"rarity":"rare"}
    
]

var resourcesGroups:Array<resourceGroupType> = [
    {"resource":"red_apple","capacity":{"min":1,max:2},"foundableIn":["forest","plaine","montagne"]},
    {"resource":"poire","capacity":{"min":1,max:2},"foundableIn":["forest","plaine","montagne"]},
    {"resource":"green_apple","capacity":{"min":1,max:2},"foundableIn":["forest","plaine","montagne"]},
    {"resource":"crab","capacity":{"min":1,max:3},"foundableIn":["river"]},
    {"resource":"perche","capacity":{"min":1,max:2},"foundableIn":["river"]},
    {"resource":"champignon","capacity":{"min":1,max:2},"foundableIn":["forest"]},
    {"resource":"champignon_tempo","capacity":{"min":1,max:2},"foundableIn":["forest"]},
    {"resource":"banane","capacity":{"min":1,max:2},"foundableIn":["forest"]},
    {"resource":"noix_de_coco","capacity":{"min":1,max:2},"foundableIn":["forest"]}
]

var resourcesRarityChances = {
    "common":25,
    "uncommon":5,
    "rare":1
}

export {resources,resourcesGroups,resourcesRarityChances}