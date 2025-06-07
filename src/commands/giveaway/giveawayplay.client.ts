import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } from "discord.js";
import { client } from "../../clientconfig";
import { cronGiveAway } from "./giveaway.service";

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "run-giveaway-button") {
        cronGiveAway();

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