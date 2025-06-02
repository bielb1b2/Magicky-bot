import { Client, Events, GatewayIntentBits } from "discord.js"
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import CONFIGBOT from "./config/configbot.json";
import { ICommands } from "./commands/interface/ICommands";
import { infoCommand } from "./infoCommand";
import { cronGiveAway } from "./commands/giveaway/giveaway.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const commandsPath = path.join(__dirname, "commands");
const commands: ICommands[] = [];

const commandFiles = fs.readdirSync(commandsPath).flatMap(dir => {
    const fullPath = path.join(commandsPath, dir);
    if (fs.statSync(fullPath).isDirectory()) {
        return fs.readdirSync(fullPath).map(file => path.join(dir, file));
    }
    return [dir];
}).filter(file => file.endsWith(".command.ts"));

for (const file of commandFiles) {
    const command: ICommands = require(path.join(commandsPath, file));
    commands.push(command);
}

client.on(Events.ClientReady, async readyClients => {
    console.log(`Logged in as ${readyClients.user.tag}!`);

    setInterval(async () => {
        await cronGiveAway();
    }, 1000 * 60);
})

client.on(Events.MessageCreate, async interaction => {
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
})



export { client }
