import noise  from "./library/noise.js"
import Canvas from "canvas"

export default class MapGenerator {

    public static async generateMap():Promise<Canvas.Canvas>{
        var allPoints = {}
        const denivelePossibility = ["51","52","53","54","55","56","57","58","59","5A","5B","5C","5D","5E","5F","61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E","7F","81","82","83","84","85","86","87","88","89","8A","8B","8C","8D","8E","8F","91","92","93","94","95","96","97","98","99","9A","9B","9C","9D","9E","9F","A1","A2","A3","A4","A5","A6","A7","A8","A9","AA","AB","AC","AD","AE","AF"]
        const montagnePossibility = ["51","52","53","54","55","56","57","58","59","5A","5B","5C","5D","5E","5F","61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E","7F","81","82","83","84","85","86","87","88","89","8A","8B","8C","8D","8E"]
        
        const waterPossibility = ["51","52","53","54","55","56","57","58","59","5A","5B","5C","5D","5E","5F","61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E","7F","81","82","83","84","85","86","87","88","89","8A","8B","8C","8D","8E","8F","91","92","93","94","95","96","97","98","99","9A","9B","9C","9D","9E","9F","A1","A2","A3","A4","A5","A6","A7","A8","A9","AA","AB","AC","AD","AE","AF"]
        
        denivelePossibility.reverse()
        waterPossibility.reverse()

        var alreadyOccupied = []
        var ccc = 6
        var startX = 45;
        var startY = 500;
        var zoom = 510
        var mapSeed = 7349
        noise.seed(mapSeed)

        var deniveleSeed = Math.floor(Math.random()*10001)
        var deniveleZoom = 200

        var forestSeed = Math.floor(Math.random()*10001)
        var forestZoom = 500

        var montagneSeed = Math.floor(Math.random()*10001)
        var montagneZoom = 200
        
        
        var nameToNameTable = []
        var xSize = 350
        var ySize = 350
        var canvas = new Canvas.Canvas(xSize,ySize)
        var ctx = canvas.getContext("2d");
        var divider = 1
        var zoomMultiplier = 1
        zoom = zoom * zoomMultiplier
        aaa(ccc)
        async function aaa(count){
            var last
            var color:string
            for (var x = 0+startX; x < xSize/divider+startX; x=x+(1/divider)) {
                for (var y = 0+startY; y < ySize/divider+startY; y=y+(1/divider)) {
                    var type = undefined
                    var paintSize = 1
                    noise.seed(mapSeed)
                    var value = Math.abs(noise.simplex3(x / zoom, y / zoom,count/400));

                    // Valeur: eau
                    if (value<0.2){
                        color = "#0000"+waterPossibility[Math.floor((value*1.5)*waterPossibility.length)]
                    }
                    //valeur: plaine
                    if (value>0.2 && value<1){

                        noise.seed(deniveleSeed)
                        var deniveleValue = Math.abs(noise.simplex3(x / deniveleZoom, y / deniveleZoom,count/400));
                        if (deniveleValue<0.02){
                            //valeur: rivière
                            type= "riviere"
                            color =  "#0000"+waterPossibility[Math.floor((deniveleValue*1.5)*waterPossibility.length)]
                        }else{
                            //valeur plaine
                            if (deniveleValue > 0.8){
                                noise.seed(montagneSeed)
                                var montagneValue = Math.abs(noise.simplex2(x / montagneZoom, y / montagneZoom));
                                if (montagneValue>0.5){
                                    type= "montagne"
                                    var uniValue = montagneValue - 0.5+deniveleValue-0.8
                                    var uniColor = montagnePossibility[Math.floor(montagnePossibility.length*uniValue/0.7)]
                                    color = "#"+uniColor+uniColor+uniColor
                                }else{
                                    noise.seed(forestSeed)
                                var forestValue = Math.abs(noise.simplex2(x / forestZoom, y / forestZoom));
                                if (forestValue > 0.75) type= "forest"
                                
                                if (forestValue > 0.75 && Math.random()>0.75 && !alreadyOccupied.find(a=>a.x==x && a.y==y)){
                                    //valeur foret
                                    //Ajout point foret
                                    type = "forest"
                                    paintSize = Math.floor(Math.random()*4)+1
                                    color = "#013d03"
                                    for (var i = 0;i<paintSize;i++){
                                        for (var j = 0;j<paintSize;j++){
                                            if (i!=0 && j!=0){
                                                alreadyOccupied.push({x:x+i,y:y+j})
                                            }
                                        }
                                    }
                                }else{
                                    if (!type) type= "plaine"
                                    color = "#00"+denivelePossibility[Math.floor(deniveleValue*denivelePossibility.length)]+"00"
                                }
                                }
                            }else{
                                noise.seed(forestSeed)
                                var forestValue = Math.abs(noise.simplex2(x / forestZoom, y / forestZoom));
                                if (forestValue > 0.75) type= "forest"
                                if (forestValue > 0.75 && Math.random()>0.75 && !alreadyOccupied.find(a=>a.x==x && a.y==y)){
                                    //valeur foret
                                    //Ajout point foret
                                    type= "forest"
                                    paintSize = Math.floor(Math.random()*4)+1
                                    color = "#013d03"
                                    for (var i = 0;i<paintSize;i++){
                                        for (var j = 0;j<paintSize;j++){
                                            if (i!=0 && j!=0){
                                                alreadyOccupied.push({x:x+i,y:y+j})
                                            }
                                        }
                                    }
                                }else{
                                    if (!type) type= "plaine"
                                    color = "#00"+denivelePossibility[Math.floor(deniveleValue*denivelePossibility.length)]+"00"
                                }
                            }
                        }
                    }
                    if (!alreadyOccupied.find(a=>a.x==x && a.y==y)){
                        ctx.beginPath();
                        ctx.fillStyle = color;
                        ctx.fillRect(x-startX,y-startY, paintSize/divider, paintSize/divider);
                        ctx.stroke();
                    }
                        var id = ""
                        var nearType  = []
                        var higherPlate
                        if (x!=0) last? higherPlate=allPoints[(x)+" "+(y-(1/divider))]:last
                        if (higherPlate) nearType.push({"type":higherPlate.type,"id":higherPlate.id});
                        var leftPlate = allPoints[(x-(1/divider))+" "+y]
                        if (leftPlate) nearType.push({"type":leftPlate.type,"id":leftPlate.id});
                        if (nearType.filter(n=>n.type == type).length==0) {
                            if (type){
                                id = ""+Date.now()+Math.random()*10000
                                nameToNameTable.push({"type":type,"ids":[id]})
                            }
                        }
                        if (nearType.filter(n=>n.type == type).length==1) id=nearType.find(n=>n.type == type).id
                        if (nearType.filter(n=>n.type == type).length==2) {
                            if (nearType[0].id!=nearType[1].id){
                                if (!nameToNameTable.find(n=>n.ids.find(t=>t == nearType[1].id) && n.ids.find(t=>t == nearType[0].id))){
                            
                                    //console.log(nearType)
                                    //console.log(nameToNameTable)
                                    var base = nameToNameTable.find(n=>n.ids.find(t=>t == nearType[0].id))
                                    var toDelete = nameToNameTable.findIndex(n=>n.ids.find(t=>t == nearType[1].id))
                                        for (var k in nameToNameTable[toDelete].ids){
                                            base.ids.push(nameToNameTable[toDelete].ids[k])
                                        }
                                        //console.log("delete "+base.toString()+" "+nameToNameTable[toDelete].toString())
                                        nameToNameTable.splice(toDelete,1)
                                    
                                }
                            }
                            id=nearType[0].id
                        }
                        if (type){
                            allPoints[x+" "+y] = {type:type,x:x,y:y,"id":id}
                            last = {type:type,x:x,y:y,"id":id}
                            ////console.log(type)
                        }else{
                            last = undefined
                        }
                    
                }
                //console.log(x)
            }
            
        }
        var total = []
    var found = {}
    var idFast = {}
    for (var x = 0+startX; x < xSize/divider+startX; x=x+(1/divider)) {
        ////console.log(x)
        for (var y = 0+startY; y < ySize/divider+startY;y=y+(1/divider)) {
            ////console.log(found.length)
            if (allPoints[x+" "+y]){
                if (!found[allPoints[x+" "+y].id]){
                    var toAdd = nameToNameTable.find(n=>n.ids.find(t=>t == allPoints[x+" "+y].id))
                    total.push(toAdd)
                    for (var i in toAdd.ids){
                        found[toAdd.ids[i]] = total.length-1
                    }
                }else{
                    /*ctx2.beginPath();
                    ctx2.fillStyle = found[allPoints[x+" "+y].id];
                    ctx2.fillRect(x-startX,y-startY, 1, 1);
                    ctx2.stroke();*/
                }
            }
        }
    }
    var alreadyInList = {}
    var currentTime = Date.now()
    console.log(total)
    for (var i in total){
        if (total[i].type!="plaine"){
            var currentTable = []
            for (var x = 0+startX; x < xSize/divider+startX; x=x+(1/divider)) {
                ////console.log(x)
                for (var y = 0+startY; y < ySize/divider+startY; y=y+(1/divider)) {
                    ////console.log(found.length)
                    if (allPoints[x+" "+y]){
                        
                        if (!alreadyInList[x+" "+y] && found[allPoints[x+" "+y].id] == i ){
                            currentTable.push({"x":x,y:y})
                            alreadyInList[x+" "+y] = true
                        }
                    }
                }
            }
            if (currentTable.length>200){
                currentTable.sort(function(a,b){
                    return (b.x+b.y)-(a.x+a.y)
                })
                var choosen = currentTable[Math.floor(currentTable.length/2)]
                console.log(choosen.x-startX,choosen.y-startY)
                ctx.font = "11px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = "black";
                ctx.fillText(total[i].type, choosen.x-startX, choosen.y-startY);
                ctx.font = "11px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(total[i].type, choosen.x-startX+2, choosen.y-startY-2);
            }
        }
    }
    return canvas
    }
}