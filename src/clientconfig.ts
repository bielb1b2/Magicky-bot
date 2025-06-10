import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from "discord.js";

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

        // TODO: Refactoring cooldowns
        if (!client.cooldowns.has(command.data.name)) {
            client.cooldowns.set(command.data.name, new Collection());
        }
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
        if (timestamps!.has(interaction.user.id)) {
            const expirationTime = timestamps!.get(interaction.user.id)! + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = Math.round((expirationTime - now) / 1000);
                await interaction.reply({ content: `Please wait ${timeLeft} more seconds before using this command again.`, options: { ephemeral: true } });
                return;
            }
        }
        timestamps!.set(interaction.user.id, now);
        setTimeout(() => timestamps!.delete(interaction.user.id), cooldownAmount);

        // Execute the command
        await command.execute(interaction);
    } catch (error) {
        console.error("Error executing slash command:", error);
    }
})


export { client, rest };
