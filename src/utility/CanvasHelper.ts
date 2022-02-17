import Canvas from "canvas";
import Map from "../class/map/Map";
import Player from "../class/player/Player";

export default class CanvasHelper {
    static async generatePlayerProfil(player:Player):Promise<string>{
        const canvas = Canvas.createCanvas(800,200);
		const ctx = canvas.getContext('2d');
        var time = Date.now()
		var backgroundImg =  await Canvas.loadImage("https://wallpapercave.com/wp/wp4462550.png")
        console.log("Wallpaper time : "+(Date.now()-time))
		ctx.drawImage(backgroundImg,200,0,600,337)
        time = Date.now()
		var profileImage = await Canvas.loadImage(player.discordUser.displayAvatarURL({"format":"png"}))
        console.log("Player image time : "+(Date.now()-time))
		ctx.drawImage(profileImage,0,0,200,200)
		ctx.font = '50px Roboto ';	
		ctx.fillStyle = '#000000';	
		ctx.fillText(player.discordUser.username, 224, 51)
		ctx.font = '50px Roboto ';	
		ctx.fillStyle = '#ffffff';	
		ctx.fillText(player.discordUser.username, 220, 50)
        time = Date.now()
		var coinImage = await Canvas.loadImage("https://cdn.discordapp.com/attachments/760153787632713748/771444541592436736/Coin.svg")
        console.log("Coin time : "+(Date.now()-time))
		ctx.drawImage(coinImage,220,75,50,50)
		ctx.font = '50px Roboto ';	
		ctx.fillStyle = '#000000';	
		ctx.fillText(player.data.coins.toString(), 284, 115)
		ctx.font = '50px Roboto ';	
		ctx.fillStyle = '#ffac33';	
		ctx.fillText(player.data.coins.toString(), 280, 115)
        time = Date.now()
		var returnImg = await Map.hostBuffer(canvas.toBuffer())
        console.log("Hosting time : "+(Date.now()-time))
		return returnImg
    }
}