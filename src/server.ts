import { Client, Events, GatewayIntentBits } from 'discord.js'
import { env } from './env/index';

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

if(env.error) {
    env.error.errors.forEach(item => {
        console.error(item.message)
    })

    throw new Error("Stop Bot!")
}


client.on(Events.ClientReady, readyClients => {
    console.log(`Logged in as ${readyClients.user.tag}!`);
})

client.on(Events.MessageCreate, interaction => {
    console.log("Olhos ardem")
    console.log(interaction)
})

client.login(env.data.DISCORD_TOKEN)

