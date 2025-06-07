import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { DateTime } from "luxon";

import { ISlashCommand } from "../ISlashCommand";
import { registeredDraws } from "./registered-draws";

const giveawayCommand: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Start a giveaway")
        .addStringOption(option =>
            option.setName("title")
                .setDescription("The title of the giveaway")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("description")
                .setDescription("The description of the giveaway")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("winners")
                .setDescription("The number of winners")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10))
        .addIntegerOption(option =>
            option.setName("day_of_execute")
                .setDescription("The day of the month when the giveaway will be executed (1-31)")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(31))
        .addIntegerOption(option =>
            option.setName("month_of_execute")
                .setDescription("The month when the giveaway will be executed (1-12)")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(12))
        .addIntegerOption(option =>
            option.setName("hour_of_execute")
                .setDescription("The hour when the giveaway will be executed (0-23)")
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(23)),
    async execute(interaction) {
        const executionDate = DateTime.fromObject({
            year: DateTime.now().year,
            day: interaction.options.getInteger("day_of_execute")!,
            month: interaction.options.getInteger("month_of_execute")!,
            hour: interaction.options.getInteger("hour_of_execute")!,
        }, { zone: "America/Sao_Paulo" });

        if(executionDate < DateTime.now().setZone("America/Sao_Paulo").set({ minute: 0, second: 0, millisecond: 0 }) || !executionDate.isValid) {
            await interaction.reply("The execution date is invalid. Please ensure it is in the future and correctly formatted.");
            return;
        }

        const joinButton = new ButtonBuilder()
            .setCustomId("giveaway-button")
            .setLabel("Participate")
            .setStyle(ButtonStyle.Primary)

        const runGiveawayButton = new ButtonBuilder()
            .setCustomId("run-giveaway-button")
            .setLabel("Run Giveaway")
            .setStyle(ButtonStyle.Success)
        
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(joinButton)
            .addComponents(runGiveawayButton);
        
        const title = interaction.options.getString("title")!;
        const description = interaction.options.getString("description")!;
        const winners = interaction.options.getInteger("winners")!;

        const message = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .addFields([
                { name: "Winners", value: winners.toString(), inline: true },
                { name: "Execution Date", value: executionDate.toISODate(), inline: true },
            ])

        const reply = await interaction.reply({
            embeds: [message],
            components: [row],
            withResponse: true
        })

        registeredDraws.push({
            id: reply.interaction.responseMessageId!,
            guildInfo: {
                guildId: interaction.guild!.id,
                messageId: interaction.id,
                channelId: interaction.channelId,
            },
            giveawayInfo: {
                title: title,
                description: description,
                winners: winners.toString(),
                executionDate: executionDate.toISO(),
                participants: [],
            }
        })

    }
}

export { giveawayCommand };
