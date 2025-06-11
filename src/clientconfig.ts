import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";

import { cronGiveAway } from "./commands/giveaway/services/giveaway.cron";
import { slashCommands } from "./commands/loadCommands";

interface CustomClient extends Client {
    cooldowns: Map<string, Map<string, number>>;
}

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
}) as CustomClient;

const rest = new REST();

client.on(Events.ClientReady, async readyClients => {
    console.log(`Logged in as ${readyClients.user.tag}!`);
    console.log("Slash Commands Loaded: ", slashCommands.map(command => command.data.name).join(", "));

    client.cooldowns = new Map();

    setInterval(() => {
        cronGiveAway();
    }, 1000 * 60); // Every minute

    await rest.put(
        Routes.applicationCommands("1338318534660329552"),
        { body: slashCommands.map(command => command.data) }
    );
})


client.on(Events.InteractionCreate, async interaction => {
    try {
        if(!interaction.isChatInputCommand()) return;
        if(interaction.user.bot) return;

        const command = slashCommands.find(cmd => cmd.data.name === interaction.commandName);
        if(!command) {
            await interaction.reply({ content: "Command not found!", options: { ephemeral: true } });
            return;
        }

        // Comands that can only be used in a server
        if(command.serverOnly && !interaction.guild) {
            await interaction.reply({ content: "This command can only be used in a server.", options: { ephemeral: true } });
            return;
        }

        // Execute the command
        await command.execute(interaction);
    } catch (error) {
        console.error("Error executing slash command:", error);
    }
})


export { client, rest };
