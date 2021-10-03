import resourceGroupType from "../types/resources/resourceGroupType";
import resourceType from "../types/resources/resourceType";

var resources:Array<resourceType> = [
    {"id":"red_apple","emoji":"🍎","name":{fr:"Pomme rouge","en":" Red apple"},"type":"fruit","subtype":"apple","bonus":{health:5,shield:0,effects:[]},"rarity":"common"}
]

var resourcesGroups:Array<resourceGroupType> = [
    {"resource":"red_apple","capacity":{"min":1,max:3},"foundableIn":["forest","plaine","river","montagne"]}
]

var resourcesRarityChances = {
    "common":50
}

export {resources,resourcesGroups,resourcesRarityChances}