type commandFile = {
    "file":string,
    "command":string
}

var totalCommands:Array<commandFile> = [];

totalCommands.push({"file":"test","command":"test"})
totalCommands.push({"file":"profil","command":"profil"})

export {totalCommands};
export default commandFile;