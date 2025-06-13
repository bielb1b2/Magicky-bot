import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } from "discord.js";
import { client } from "../../../clientconfig";
import { registeredDraws } from "../repositories/registered-draws";

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "giveaway-button") {
        const userId = interaction.user.id;
        const giveaway = registeredDraws.find(draw => draw.id === interaction.message.id);
        if(!giveaway) {
            await interaction.reply({ content: "Giveaway not found!!!", options: { ephemeral: true } });
            return;
        }

        const userIsAlreadyInEvent = giveaway.giveawayInfo.participants.find(item => item === userId);
        if(userIsAlreadyInEvent) {
            await interaction.reply({ content: "You're already in event", options: { ephemeral: true } })
            return;
        }

        const joinButtonUpdated = new ButtonBuilder()
            .setCustomId("giveaway-button")
            .setLabel(`Participate (${giveaway.giveawayInfo.participants.length + 1})`)
            .setStyle(ButtonStyle.Primary)

        const runGiveawayButton = new ButtonBuilder()
            .setCustomId("run-giveaway-button")
            .setLabel("Run Giveaway")
            .setStyle(ButtonStyle.Success)

        const deleteButton = new ButtonBuilder()
            .setCustomId("delete-giveaway-button")
            .setLabel("Delete Giveaway")
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(joinButtonUpdated)
            .addComponents(runGiveawayButton)
            .addComponents(deleteButton);

        giveaway.giveawayInfo.participants.push(userId);

        await interaction.message.edit({ components: [row] })
        await interaction.reply({ content: "Now you are in the event", options: { ephemeral: true }});
    }
})