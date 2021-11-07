type commandFile = {
    "file":string,
    "command":string,
    "needAlive":boolean,
    "description":string
}

var totalCommands:Array<commandFile> = [];

totalCommands.push({"file":"test","command":"test","needAlive":true,"description":"Ceci n'est qu'un test"})
totalCommands.push({"file":"help","command":"help","needAlive":true,"description":"Affiche ce help"})
totalCommands.push({"file":"profil","command":"profil","needAlive":true,"description":"Affiche votre profil"})
totalCommands.push({"file":"use","command":"use","needAlive":true,"description":"Utilise une arme dans votre inventaire"})
totalCommands.push({"file":"respawn","command":"respawn","needAlive":false,"description":"Permet de respawn quand vous êtes mort"})
totalCommands.push({"file":"inventory","command":"inventory","needAlive":true,"description":"Permet de voir l'inventaire"})
totalCommands.push({"file":"box","command":"box","needAlive":true,"description":"Permet de voir toutes les box que vous avez"})
totalCommands.push({"file":"register","command":"register","needAlive":false,"description":"Permet de s'inscrire sur le bot"})
totalCommands.push({"file":"map","command":"map","needAlive":true,"description":"Permet de voir la carte de BattleBot"})
totalCommands.push({"file":"shop","command":"shop","needAlive":true,"description":"Permet d'acheter des box et de se faire livrer sur l'ile"})
totalCommands.push({"file":"hourly","command":"hourly","needAlive":true,"description":"Permet de récupérer votre bonus hourly"})
totalCommands.push({"file":"cooldown","command":"cooldown","needAlive":true,"description":"Permet de voir vos cooldowns"})
totalCommands.push({"file":"search","command":"search","needAlive":true,"description":"Permet de chercher des ressources"})
totalCommands.push({"file":"resource","command":"resource","needAlive":true,"description":"Permet de voir toutes ses ressources"})
totalCommands.push({"file":"food","command":"food","needAlive":true,"description":"Permet de voir tous ses plats cuisinés"})
totalCommands.push({"file":"cook","command":"cook","needAlive":true,"description":"Permet de cuisiner un plat"})
totalCommands.push({"file":"eat","command":"eat","needAlive":true,"description":"Permet de manger un plat"})
totalCommands.push({"file":"info","command":"info","needAlive":true,"description":"Permet de voir les informations d'une arme"})

export {totalCommands};
export default commandFile;