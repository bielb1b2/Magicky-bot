import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, MessageFlags } from "discord.js";
import { client } from "../../clientconfig";
import { registeredDraws } from "./registered-draws";

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "giveaway-button") {
        const userId = interaction.user.id;
        const giveaway = registeredDraws.find(draw => draw.id === interaction.message.id);
        if(!giveaway) {
            await interaction.reply({ content: "Giveaway not found!!!", flags: MessageFlags.Ephemeral  })
            return;
        }

        const userIsAlreadyInEvent = giveaway.giveawayInfo.participants.find(item => item === userId);
        if(userIsAlreadyInEvent) {
            await interaction.reply({ content: "You're already in event", flags: MessageFlags.Ephemeral  })
            return;
        }

        const joinButtonUpdated = new ButtonBuilder()
            .setCustomId("giveaway-button")
            .setLabel(`Participate (${giveaway.giveawayInfo.participants.length + 1})`)
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(joinButtonUpdated)

        giveaway.giveawayInfo.participants.push(userId);

        await interaction.message.edit({ components: [row] })
        await interaction.reply({ content: "Now you are in the event", flags: MessageFlags.Ephemeral });
    }
})