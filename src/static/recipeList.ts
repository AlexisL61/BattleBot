import recipe from "../types/resources/recipe";

var recipes:Array<recipe> = [
    {"name":{"fr":"Tarte aux pommes","en":"Tarte aux pommes"},"id":"tarte_pomme","bonus":{"health":5,"shield":0,effects:[]},"need":["apple","apple","apple"],"emoji":""},
    {"name":{"fr":"Tarte à la poire","en":"Tarte à la poire"},"id":"tarte_poire","bonus":{"health":0,"shield":3,effects:[]},"need":["poire","poire","poire"],"emoji":""},
    {"name":{"fr":"Salade de fruits","en":"Salade de fruits"},"id":"salade_fruit","bonus":{"health":2,"shield":2,effects:[]},"need":["fruit","fruit","fruit","fruit","fruit"],"emoji":""},
    {"name":{"fr":"Brochette de fruits","en":"Brochette de fruits"},"id":"brochette_fruit","bonus":{"health":3,"shield":0,effects:[]},"need":["fruit","fruit","fruit"],"emoji":""},
    {"name":{"fr":"Brochette de la mer","en":"Brochette de la me"},"id":"brochette_mer","bonus":{"health":0,"shield":3,effects:[]},"need":["mer","mer","mer"],"emoji":""},
    {"name":{"fr":"Brochette terre-mer","en":"Brochette terre-mer"},"id":"brochette_terre_mer","bonus":{"health":2,"shield":1,effects:[]},"need":["terre","mer"],"emoji":""}
]

export default recipes