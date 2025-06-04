import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../ISlashCommand";

const pingCommand: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction) {
        const diffTime = interaction.createdTimestamp - Date.now();

        const message = new EmbedBuilder()
            .setColor(Colors.Aqua)
            .setTitle("Pong!")
            .setDescription(`Latency is \`${diffTime}ms\``)
            .setFooter({ text: "Magicky bot"})

        await interaction.reply({ embeds: [message] });
        return;
    }
}

export { pingCommand };