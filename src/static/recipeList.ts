import recipe from "../types/resources/recipe";

var recipes:Array<recipe> = [
    {"name":{"fr":"Poisson fruité","en":"Poisson fruité"},"id":"poisson_fruit","bonus":{"health":6,"shield":4,effects:[]},"need":["poisson","poisson","fruit"],"emoji":""},
    {"name":{"fr":"Poisson et crustacés","en":"Poisson et crustacés"},"id":"poisson_crustace","bonus":{"health":3,"shield":5,effects:[]},"need":["poisson","crustace","crustace"],"emoji":""},
    {"name":{"fr":"Poisson sauce champignon","en":"Poisson sauce champignon"},"id":"poisson_sauce_champi","bonus":{"health":4,"shield":5,effects:[]},"need":["poisson","champignon","champignon"],"emoji":""},
    {"name":{"fr":"Tarte aux pommes","en":"Tarte aux pommes"},"id":"tarte_pomme","bonus":{"health":4,"shield":0,effects:[]},"need":["apple","apple","apple"],"emoji":""},
    {"name":{"fr":"Tarte à la poire","en":"Tarte à la poire"},"id":"tarte_poire","bonus":{"health":0,"shield":3,effects:[]},"need":["poire","poire","poire"],"emoji":""},
    {"name":{"fr":"Salade de fruits","en":"Salade de fruits"},"id":"salade_fruit","bonus":{"health":2,"shield":2,effects:[]},"need":["fruit","fruit","fruit","fruit","fruit"],"emoji":""},
    {"name":{"fr":"Brochette de fruits","en":"Brochette de fruits"},"id":"brochette_fruit","bonus":{"health":3,"shield":0,effects:[]},"need":["fruit","fruit","fruit"],"emoji":""},
    {"name":{"fr":"Brochette de champignon","en":"Brochette de champignon"},"id":"brochette_champignon","bonus":{"health":0,"shield":3,effects:[]},"need":["champignon","champignon","champignon"],"emoji":""},
    {"name":{"fr":"Brochette de la mer","en":"Brochette de la me"},"id":"brochette_mer","bonus":{"health":0,"shield":3,effects:[]},"need":["mer","mer","mer"],"emoji":""},
    {"name":{"fr":"Brochette terre-mer","en":"Brochette terre-mer"},"id":"brochette_terre_mer","bonus":{"health":2,"shield":1,effects:[]},"need":["terre","mer"],"emoji":""}
]

export default recipes