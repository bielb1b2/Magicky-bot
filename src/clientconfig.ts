import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js"

import CONFIGBOT from "./config/configbot.json";
import { commands } from "./tokencommands/initCommands";
import { infoCommand } from "./tokencommands/info/info.command";
import { cronGiveAway } from "./tokencommands/giveaway/giveaway.service";
import { slashCommands } from "./commands/loadCommands";

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const rest = new REST();

client.on(Events.ClientReady, async readyClients => {
    console.log(`Logged in as ${readyClients.user.tag}!`);

    console.log("Slash Commands Loaded: ", slashCommands.map(command => command.data.name).join(", "));

    await rest.put(
        Routes.applicationCommands("1338318534660329552"),
        { body: slashCommands.map(command => command.data) }
    );

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


client.on(Events.InteractionCreate, async interaction => {
    try {
        if(!interaction.isChatInputCommand()) return;
        if(interaction.user.bot) return;

        const command = slashCommands.find(cmd => cmd.data.name === interaction.commandName);
        if(!command) {
            await interaction.reply({ content: "Command not found!", ephemeral: true });
            return;
        }
        await command.execute(interaction);
    } catch (error) {
        console.error("Error executing slash command:", error);
    }
})


export { client, rest }