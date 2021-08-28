type commandFile = {
    "file":string,
    "command":string,
    "needAlive":boolean
}

var totalCommands:Array<commandFile> = [];

totalCommands.push({"file":"test","command":"test","needAlive":true})
totalCommands.push({"file":"profil","command":"profil","needAlive":true})
totalCommands.push({"file":"use","command":"use","needAlive":true})
totalCommands.push({"file":"respawn","command":"respawn","needAlive":false})
totalCommands.push({"file":"inventory","command":"inventory","needAlive":true})
totalCommands.push({"file":"box","command":"box","needAlive":true})
totalCommands.push({"file":"register","command":"register","needAlive":false})
totalCommands.push({"file":"map","command":"map","needAlive":true})

export {totalCommands};
export default commandFile;