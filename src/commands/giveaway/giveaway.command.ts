import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../ISlashCommand";

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
        console.log("Giveaway command executed:", interaction.toJSON());

       interaction.reply("This command is not implemented yet. Please check back later!");
    }
}

export { giveawayCommand };