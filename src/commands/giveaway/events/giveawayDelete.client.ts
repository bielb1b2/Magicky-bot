import { EmbedBuilder, Events, TextChannel } from "discord.js";
import { client } from "../../../clientconfig";
import { registeredDraws } from "../repositories/registered-draws";

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "delete-giveaway-button") {
        const selectedGame = registeredDraws.find(item => item.id === interaction.message.id); 
        if (!selectedGame) {
            await interaction.reply({ content: "Giveaway not found!!!", options: { ephemeral: true } });
            return;
        }
        registeredDraws.splice(registeredDraws.indexOf(selectedGame), 1);

        const channel = client.channels.cache.get(selectedGame.guildInfo.channelId) as TextChannel;
        if (!channel) {
            return;
        }
        await channel.messages.fetch(selectedGame.guildInfo.messageId)
            .then(message => {
                const updatedEmbed = new EmbedBuilder()
                    .setColor("#FF0000")
                    .setDescription("Giveaway deleted!")

                message.edit({ embeds: [updatedEmbed], components: [] });
            })

        await interaction.reply({ content: "Giveaway deleted successfully!", options: { ephemeral: true } });
        return;
    }
})