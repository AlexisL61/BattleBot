import resourceGroupType from "../types/resources/resourceGroupType";
import resourceType from "../types/resources/resourceType";

var resources:Array<resourceType> = [
    {"id":"red_apple","emoji":"🍎","name":{fr:"Pomme rouge","en":" Red apple"},"types":["terre","fruit","apple"],"bonus":{health:3,shield:0,effects:[]},"rarity":"common"},
    {"id":"poire","emoji":"🍐","name":{fr:"Poire","en":"Poire"},"types":["terre","fruit","poire"],"bonus":{health:0,shield:5,effects:[]},"rarity":"uncommon"},
    {"id":"green_apple","emoji":"🍏","name":{fr:"Pomme verte","en":"Green apple"},"types":["terre","fruit","apple"],"bonus":{health:2,shield:0,effects:[]},"rarity":"common"},
    {"id":"crab","emoji":"🦀","name":{fr:"Crabe","en":"Crabe"},"types":["mer","crustace","crab"],"bonus":{health:0,shield:3,effects:[]},"rarity":"common"},
    {"id":"perche","emoji":"🐟","name":{fr:"Perche","en":"Perche"},"types":["mer","poisson","perche"],"bonus":{health:0,shield:7,effects:[]},"rarity":"uncommon"}
    
]

var resourcesGroups:Array<resourceGroupType> = [
    {"resource":"red_apple","capacity":{"min":1,max:2},"foundableIn":["forest","plaine","montagne"]},
    {"resource":"poire","capacity":{"min":1,max:3},"foundableIn":["forest","plaine","montagne"]},
    {"resource":"green_apple","capacity":{"min":1,max:3},"foundableIn":["forest","plaine","montagne"]},
    {"resource":"crab","capacity":{"min":1,max:3},"foundableIn":["river"]},
    {"resource":"perche","capacity":{"min":1,max:3},"foundableIn":["river"]}
]

var resourcesRarityChances = {
    "common":5,
    "uncommon":1
}

export {resources,resourcesGroups,resourcesRarityChances}