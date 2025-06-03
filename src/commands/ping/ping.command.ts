import { Colors, EmbedBuilder } from "discord.js";
import { ICommands } from "../../interface/ICommands";

const ping: ICommands = {
    name: "ping",
    description: "Ping!",
    howUse: "!ping",
    example: "!ping",
    async execute(interaction) {
        
        const diffTime = interaction.createdTimestamp - Date.now();

        const message = new EmbedBuilder()
            .setColor(Colors.Aqua)
            .setTitle("Pong!")
            .setDescription(`Latency is \`${diffTime}ms\``)
            .setFooter({ text: "Magicky bot"})

        interaction.reply({ embeds: [message] });
    },
}

export { ping };