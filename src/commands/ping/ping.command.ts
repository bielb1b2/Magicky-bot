import { Colors, Embed, EmbedBuilder } from "discord.js";
import { ICommands } from "../interface/ICommands";

export = {
    name: 'ping',
    description: 'Ping!',
    howUse: '!ping',
    execute(interaction, args) {
        
        const diffTime = interaction.createdTimestamp - Date.now();

        const message = new EmbedBuilder()
            .setColor(Colors.Aqua)
            .setTitle('Pong!')
            .setDescription(`Latency is \`${diffTime}ms\``)
            .setFooter({ text: "Magicky bot"})

        interaction.reply({ embeds: [message] });
    },
} as ICommands;