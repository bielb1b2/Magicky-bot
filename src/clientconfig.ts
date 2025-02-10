// Dependencies
import { Client, Events, GatewayIntentBits } from 'discord.js'
import fs from 'fs';

// Configurations
import CONFIGBOT from './config/configbot.json';
import { ICommands } from './commands/interface/ICommands';
import infoCommand from './infoCommand';

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const commands: ICommands[] = []

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command: ICommands = require(`./commands/${file}`);
    commands.push(command);
}

client.on(Events.ClientReady, readyClients => {
    console.log(`Logged in as ${readyClients.user.tag}!`);
})

client.on(Events.MessageCreate, interaction => {
    if(!interaction.content.startsWith(CONFIGBOT.prefix)) return;
    if(interaction.author.bot) return;

    const commandName = interaction.content.slice(CONFIGBOT.prefix.length).trim().split(/ +/)[0];

    if(commandName === 'info') { 
        infoCommand.execute(interaction, interaction.content.slice(CONFIGBOT.prefix.length).trim().split(/ +/).slice(1), commands);
        return;
    }

    const command = commands.find(command => command.name === commandName);
    if(!command) {
        interaction.reply("Command not found!");
        return;
    }

    command.execute(interaction, interaction.content.slice(CONFIGBOT.prefix.length).trim().split(/ +/).slice(1));
})

export { client }
