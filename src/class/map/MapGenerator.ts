const noise = require("../../../static/library/noise.js")
import Canvas, { loadImage } from "canvas"
import path from "path"
import position from "../../types/position"
import Cache from "../cache/Cache"
import Player from "../player/Player"
import Drop from "./Drop"
import Map from "./Map"

const montagneNames = ["Montagne", "Pic", "Mont", "Massif", "Sommet", "Crête", "Puy", "Colline"]
const secondNames = ["Alegro", "Poiluire", "Liville", "Colossonne", "Villeurgnan", "Levarac", "Charbéliard", "Narvin", "Grebonne", "Greçon", "Frégny", "Vitroville", "Toutoise", "Morne", "Antoveil", "Bergemasse", "Saugues", "Borcourt", "Chanesse", "Narveil", "Austral", "Martives", "Colozon", "Clateaux"]

export default class MapGenerator {
    
    public static async generateMapFromCoords(xMov,yMov,zoomP,denivele,forest,montagne,options:{opponents?:Array<Player>,playerLocation:position,pointers?:Array<{icon:string,size:number,pos:position}>,showOpponentsNum?:boolean,drops?:Array<Drop>}){
        const denivelePossibility = ["51","52","53","54","55","56","57","58","59","5A","5B","5C","5D","5E","5F","61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E","7F","81","82","83","84","85","86","87","88","89","8A","8B","8C","8D","8E","8F","91","92","93","94","95","96","97","98","99","9A","9B","9C","9D","9E","9F","A1","A2","A3","A4","A5","A6","A7","A8","A9","AA","AB","AC","AD","AE","AF"]
        const montagnePossibility = ["51","52","53","54","55","56","57","58","59","5A","5B","5C","5D","5E","5F","61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E","7F","81","82","83","84","85","86","87","88","89","8A","8B","8C","8D","8E"]
        
        const waterPossibility = ["51","52","53","54","55","56","57","58","59","5A","5B","5C","5D","5E","5F","61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E","7F","81","82","83","84","85","86","87","88","89","8A","8B","8C","8D","8E","8F","91","92","93","94","95","96","97","98","99","9A","9B","9C","9D","9E","9F","A1","A2","A3","A4","A5","A6","A7","A8","A9","AA","AB","AC","AD","AE","AF"]
        
        denivelePossibility.reverse()
        waterPossibility.reverse()
        
        var alreadyOccupied = {}
        var count = 6
        //console.log(175/zoomP)
        var startX = 45+xMov/10+175-100/zoomP;
        var startY = 500+yMov/10+175-100/zoomP;
        var zoom = 510
        var mapSeed = 7349
        noise.seed(mapSeed)
        
        var deniveleSeed = denivele
        var deniveleZoom = 200
        
        var forestSeed = forest
        var forestZoom = 500
        
        var montagneSeed = montagne
        var montagneZoom = 200
        var zoomMultiplier = 1
        
        var nameToNameTable = []
        var xSize = 200
        var ySize = 200
        var canvas = new Canvas.Canvas(xSize,ySize)
        var ctx = canvas.getContext("2d");
        
        Canvas.registerFont('./static/font/Roboto-Regular.ttf',{"family":"Roboto"})
        var divider = zoomP
        zoom = zoom * zoomMultiplier
        var last
        var color:string
        console.log("BBBBBBB "+Map.searchExistentMap({"x":xMov,"y":yMov},zoomP))
        if (!Map.searchExistentMap({"x":xMov,"y":yMov},zoomP)){
            for (var x = 0+startX; x < xSize/divider+startX; x=x+(1/divider)) {
                //console.log(x,1/divider)
                for (var y = 0+startY; y < ySize/divider+startY; y=y+(1/divider)) {
                    var type = undefined
                    var paintSize = 1
                    noise.seed(mapSeed)
                    var value
                   
                        value = Math.abs(noise.simplex3(x / zoom, y / zoom,count/400));
                        
                        // Valeur: eau
                        if (value<0.2){
                            color = "#0000"+waterPossibility[Math.floor((value*1.5)*waterPossibility.length)]
                        }
                        //valeur: plaine
                        if (value>0.2 && value<1){
                            
                            noise.seed(deniveleSeed)
                            var deniveleValue = Math.abs(noise.simplex3((x) / deniveleZoom, (y) / deniveleZoom,count/400));
                            if (deniveleValue<0.02){
                                //valeur: rivière
                                type= "river"
                                color =  "#0000"+waterPossibility[Math.floor((deniveleValue*1.5)*waterPossibility.length)]
                            }else{
                                //valeur plaine
                                if (deniveleValue > 0.8){
                                    noise.seed(montagneSeed)
                                    var montagneValue = Math.abs(noise.simplex2((x) / montagneZoom, (y) / montagneZoom));
                                    if (montagneValue>0.5){
                                        type= "montagne"
                                        var uniValue = montagneValue - 0.5+deniveleValue-0.8
                                        var uniColor = montagnePossibility[Math.floor(montagnePossibility.length*uniValue/0.7)]
                                        color = "#"+uniColor+uniColor+uniColor
                                    }else{
                                        noise.seed(forestSeed)
                                        var forestValue = Math.abs(noise.simplex2((x) / forestZoom, (y) / forestZoom));
                                        if (forestValue > 0.75) type= "forest"
                                        
                                        if (forestValue > 0.75 && Math.random()>0.75 && !alreadyOccupied[x +"|"+y]){
                                            //valeur forest
                                            //Ajout point forest
                                            type = "forest"
                                            paintSize = Math.floor(Math.random()*4)+1
                                            color = "#013d03"
                                            for (var i = 0;i<paintSize/divider;i=i+1/divider){
                                                for (var j = 0;j<paintSize/divider;j=j+1/divider){
                                                    if (i!=0 && j!=0){
                                                        alreadyOccupied[(x+i)+"|"+(y+j)] = true
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
                                    var forestValue = Math.abs(noise.simplex2((x) / forestZoom, (y) / forestZoom));
                                    if (forestValue > 0.75) type= "forest"
                                    if (forestValue > 0.75 && Math.random()>0.75 && !alreadyOccupied[x+"|"+y]){
                                        //valeur forest
                                        //Ajout point forest
                                        type= "forest"
                                        paintSize = Math.floor(Math.random()*4)+1
                                        color = "#013d03"
                                        for (var i = 0;i<paintSize/divider;i=i+1/divider){
                                            for (var j = 0;j<paintSize/divider;j=j+1/divider){
                                                if (i!=0 && j!=0){
                                                    alreadyOccupied[(x+i)+"|"+(y+j)] = true
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
                        //console.log(x+";"+y)
                    if (!alreadyOccupied[x+"|"+y]){
                        //console.log((x-xMov-startX)*divider)
                        ctx.beginPath();
                        ctx.fillStyle = color;
                        ctx.fillRect(((x-startX)*divider),((y-startY)*divider), paintSize, paintSize);
                        //console.log((x)-startX,(y*divider)-startY)
                        ctx.stroke();
                        //console.log(options.playerLocation.x,options.playerLocation.y,x,y)
                        
                    }
                }
            }
            //console.log(canvas.toBuffer())
            Cache.mapAdd({"x":xMov,"y":yMov},zoomP,canvas.toBuffer())
        }else{
            /*console.log("AAAAAAA "+Map.searchExistentMap({"x":xMov,"y":yMov},zoomP))
            var ancientImage = new Canvas.Image()
            ancientImage.src =  Map.searchExistentMap({"x":xMov,"y":yMov},zoomP)*/
            var img = await loadImage(__dirname+"/../../static/map_images/"+Map.searchExistentMap({"x":xMov,"y":yMov},zoomP))
            ctx.drawImage(img,0,0,200,200)
        }
        console.log("AAAAAAAAAAAAAAAAAAAAAA")
        for (var x = 0+startX; x < xSize/divider+startX; x=x+(1/divider)) {
            //console.log(x,1/divider)
            for (var y = 0+startY; y < ySize/divider+startY; y=y+(1/divider)) {
                if (Math.sqrt(Math.pow(x-45-(options.playerLocation.x+1750)/10,2)+Math.pow(y-500-(options.playerLocation.y+1750)/10,2))<=Player.visibilityRadius/10){

                    ctx.beginPath();
                    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                    ctx.fillRect(((x-startX)*divider),((y-startY)*divider), 1, 1);
                    //console.log((x)-startX,(y*divider)-startY)
                    ctx.stroke();
                }
            }
        }
        if (options && options.drops){
            var startXLocal = startX - 45
            var startYLocal = startY-500
            var finalX = xSize/divider+startX-45
            var finalY =  ySize/divider+startY-500
            for (var d in options.drops){
                var dropLocalX = (options.drops[d].position.x+1750) /10
                var dropLocalY = (options.drops[d].position.y+1750) /10
                if (dropLocalX>startXLocal && dropLocalX<finalX && dropLocalY>startYLocal && dropLocalY<finalY){
                    if (options.drops[d].timeAvailable<Date.now()){
                        var imageLoaded = await loadImage("./static/images/map/dropBox.png")
                        ctx.drawImage(imageLoaded,(dropLocalX-startXLocal)*xSize/(finalX-startXLocal)-10,(dropLocalY-startYLocal)*ySize/(finalY-startYLocal)-10,20,20)
                    }else{
                        var imageLoaded = await loadImage("./static/images/map/drop.png")
                        ctx.drawImage(imageLoaded,(dropLocalX-startXLocal)*xSize/(finalX-startXLocal)-10,(dropLocalY-startYLocal)*ySize/(finalY-startYLocal)-10,20,20)
                    }
                }
            }
        }
        if (options && options.playerLocation){
            var startXLocal = startX - 45
            var startYLocal = startY-500
            var playerLocalX = (options.playerLocation.x+1750) /10
            var playerLocalY = (options.playerLocation.y+1750) /10
            var finalX = xSize/divider+startX-45
            var finalY =  ySize/divider+startY-500
            if (playerLocalX>startXLocal && playerLocalX<finalX && playerLocalY>startYLocal && playerLocalY<finalY){
                console.log(playerLocalX-startXLocal,playerLocalY-startYLocal)
                ctx.beginPath();
                ctx.fillStyle = "#0000FF";
                ctx.fillRect((playerLocalX-startXLocal)*xSize/(finalX-startXLocal)-5,(playerLocalY-startYLocal)*ySize/(finalY-startYLocal)-5,10,10)
                ctx.stroke()
            }
        }
        if (options && options.opponents){
            var startXLocal = startX - 45
            var startYLocal = startY-500
            var finalX = xSize/divider+startX-45
            var finalY =  ySize/divider+startY-500
            for (var o in options.opponents){
                var playerLocalX = (options.opponents[o].getRealPosition().x+1750) /10
                var playerLocalY = (options.opponents[o].getRealPosition().y+1750) /10
                if (Math.sqrt(Math.pow(options.opponents[o].getRealPosition().x-options.playerLocation.x,2)+Math.pow(options.opponents[o].getRealPosition().y-options.playerLocation.y,2))<=Player.visibilityRadius && playerLocalX>startXLocal && playerLocalX<finalX && playerLocalY>startYLocal && playerLocalY<finalY){
                    console.log(playerLocalX-startXLocal,playerLocalY-startYLocal)
                    ctx.beginPath();
                    ctx.fillStyle = "#FF0000";
                    ctx.fillRect((playerLocalX-startXLocal)*xSize/(finalX-startXLocal)-5,(playerLocalY-startYLocal)*ySize/(finalY-startYLocal)-5,10,10)
                    ctx.stroke()
                    ctx.fillStyle = "#FFFFFF";
                    ctx.textAlign = 'center'
                    ctx.font = "10px"
                    if (options.showOpponentsNum==true){
                        ctx.fillText((parseInt(o)+1).toString(),(playerLocalX-startXLocal)*xSize/(finalX-startXLocal),(playerLocalY-startYLocal)*ySize/(finalY-startYLocal)+15,10)
                    }
                }
            }
        }
        if (options.playerLocation.x != xMov || options.playerLocation.y != yMov){
            var imageLoaded = await loadImage("./static/images/map/pointer.png")
            ctx.drawImage(imageLoaded,80,60,40,40)
        }
        if (options.pointers){
            var startXLocal = startX - 45
            var startYLocal = startY-500
            var finalX = xSize/divider+startX-45
            var finalY =  ySize/divider+startY-500
            for (var p in options.pointers){
                var playerLocalX = (options.pointers[p].pos.x+1750) /10
                var playerLocalY = (options.pointers[p].pos.y+1750) /10
                if (playerLocalX>startXLocal && playerLocalX<finalX && playerLocalY>startYLocal && playerLocalY<finalY){
                    var imageLoaded = await loadImage("./static/images/map/pointer.png")
                    ctx.drawImage(imageLoaded,(playerLocalX-startXLocal)*xSize/(finalX-startXLocal)-options.pointers[p].size/2,(playerLocalY-startYLocal)*ySize/(finalY-startYLocal)-options.pointers[p].size,options.pointers[p].size,options.pointers[p].size)
                    var iconLoaded = await loadImage(options.pointers[p].icon)
                    ctx.drawImage(iconLoaded,(playerLocalX-startXLocal)*xSize/(finalX-startXLocal)-options.pointers[p].size/4/2,(playerLocalY-startYLocal)*ySize/(finalY-startYLocal)-options.pointers[p].size/1.5,options.pointers[p].size/4,options.pointers[p].size/4)
                    
                }
            }
        }
        
        //console.log(canvas)
        return canvas.toBuffer()
    }
    
    public static async generateMap():Promise<{canvas:Canvas.Canvas,deniveleSeed:number,forestSeed:number,montagneSeed:number,pixels:Array<{pixels:Array<any>,location:{name:string,type:"forest"|"river"|"montagne"|"plaine"}}>}>{
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
        
        Canvas.registerFont('./static/font/Roboto-Regular.ttf',{"family":"Roboto"})
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
                            type= "river"
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
                                        //valeur forest
                                        //Ajout point forest
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
                                    //valeur forest
                                    //Ajout point forest
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
        console.log(total)
        var totalPixels = []
        for (var i in total){
            if (total[i].type!="plaine"){
                var currentTable = []
                for (var x = 0+startX; x < xSize/divider+startX; x=x+(1/divider)) {
                    ////console.log(x)
                    for (var y = 0+startY; y < ySize/divider+startY; y=y+(1/divider)) {
                        ////console.log(found.length)
                        if (allPoints[x+" "+y]){
                            
                            if (!alreadyInList[x+" "+y] && found[allPoints[x+" "+y].id] == i ){
                                currentTable.push({"x":(x-45)*10-1750,y:(y-500)*10-1750})
                                alreadyInList[x+" "+y] = true
                            }
                        }
                    }
                }
                console.log(currentTable)
                if (currentTable.length>200){
                    currentTable.sort(function(a,b){
                        return (b.x+b.y)-(a.x+a.y)
                    })
                    var firstNameChoosen = total[i].type
                    if (total[i].type == "montagne"){
                        firstNameChoosen = montagneNames[Math.floor(Math.random()*montagneNames.length)]
                    }
                    var secondNameChoosen = ""
                    secondNameChoosen = secondNames[Math.floor(Math.random()*secondNames.length)]
                    var choosen = currentTable[Math.floor(currentTable.length/2)]
                    ctx.font = "11px Roboto";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "black";
                    ctx.fillText(firstNameChoosen, ((choosen.x+1750)/10+45)-startX, ((choosen.y+1750)/10+500)-startY);
                    ctx.font = "11px Roboto";
                    ctx.fillStyle = "white";
                    ctx.textAlign = "center";
                    ctx.fillText(firstNameChoosen,((choosen.x+1750)/10+45)-startX+1, ((choosen.y+1750)/10+500)-startY-1);
                    ctx.font = "11px Roboto";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "black";
                    ctx.fillText(secondNameChoosen, ((choosen.x+1750)/10+45)-startX, ((choosen.y+1750)/10+500)-startY+13);
                    ctx.font = "11px Roboto";
                    ctx.fillStyle = "white";
                    ctx.textAlign = "center";
                    ctx.fillText(secondNameChoosen, ((choosen.x+1750)/10+45)-startX+1, ((choosen.y+1750)/10+500)-startY-1+13);
                }
                totalPixels.push({"location":{"name":firstNameChoosen+" "+secondNameChoosen,type:total[i].type},pixels:currentTable})
            }
        }
        return {canvas:canvas,forestSeed:forestSeed,deniveleSeed:deniveleSeed,montagneSeed:montagneSeed,pixels:totalPixels}
    }
}