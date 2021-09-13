import { CommandInteraction, Interaction, Message, TextBasedChannels } from "discord.js";

type commandSender = {
    "message"?:Message,
    "interaction"?:CommandInteraction,
    "type":"MESSAGE"|"INTERACTION",
    "channelSent":TextBasedChannels
}

export default commandSender