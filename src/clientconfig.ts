import { Client, Events, GatewayIntentBits } from "discord.js"

import CONFIGBOT from "./config/configbot.json";
import { commands } from "./commands/initCommands";
import { infoCommand } from "./commands/info/info.command";
import { cronGiveAway } from "./commands/giveaway/giveaway.service";

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on(Events.ClientReady, async readyClients => {
    console.log(`Logged in as ${readyClients.user.tag}!`);

    setInterval(async () => {
        await cronGiveAway();
    }, 1000 * 60);
})

client.on(Events.MessageCreate, async interaction => {
    try {
        if(!interaction.content.startsWith(CONFIGBOT.prefix)) return;
        if(interaction.author.bot) return;

        const commandName = interaction.content.slice(CONFIGBOT.prefix.length).trim().split(/ +/)[0];

        if(commandName === "info") { 
            infoCommand.execute(interaction, interaction.content.slice(CONFIGBOT.prefix.length).trim().split(/ +/).slice(1), commands);
            return;
        }

        const command = commands.find(command => command.name === commandName);
        if(!command) {
            interaction.reply("Command not found!");
            return;
        }

        const args = interaction.content.slice(CONFIGBOT.prefix.length).trim().match(/(?:[^\s"]+|"[^"]*")+/g)?.slice(1).map(arg => arg.replace(/['"]+/g, "")) || []

        await command.execute(interaction, args);
    } catch (error) {
        console.error("Error executing command:", error);
    }
})

export { client }