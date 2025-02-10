import { Colors, Embed, EmbedBuilder } from "discord.js";
import { ICommands } from "./interface/ICommands";

export = {
    name: 'ping',
    description: 'Ping!',
    howUse: '!ping',
    execute(interaction, args) {
        
        const diffTime = interaction.createdTimestamp - Date.now();

        const message = new EmbedBuilder()
            .setColor(Colors.Aqua)
            .setTitle('Pong!')
            .setThumbnail('https://64.media.tumblr.com/a7546dd4c493db59e1daf121d17e6b24/a5c119b62086e15c-14/s1280x1920/a840bd5725e085f91ebebf2a77b80eb01162db86.pnj')
            .setDescription(`Latency is ${diffTime}ms`)
            .setFooter({ text: "Magicky bot"})

        interaction.reply({ embeds: [message] });
    },
} as ICommands;