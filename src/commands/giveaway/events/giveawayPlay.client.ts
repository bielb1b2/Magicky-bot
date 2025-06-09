import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } from "discord.js";
import { client } from "../../../clientconfig";
import { registeredDraws } from "../repositorys/registered-draws";
import { endGiveaway } from "../services/giveaway.service";

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "run-giveaway-button") {
        const selectedGame = registeredDraws.find(item => item.id === interaction.message.id); 
        if (!selectedGame) {
            await interaction.reply({ content: "Giveaway not found!!!", options: { ephemeral: true } });
            return;
        }
        registeredDraws.splice(registeredDraws.indexOf(selectedGame), 1);

        endGiveaway(selectedGame);

        const runGiveawayButton = new ButtonBuilder()
            .setCustomId("run-giveaway-button")
            .setLabel("Giveaway is ended")
            .setEmoji("🎉")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(runGiveawayButton);

        await interaction.message.edit({ components: [row] });
    }
})