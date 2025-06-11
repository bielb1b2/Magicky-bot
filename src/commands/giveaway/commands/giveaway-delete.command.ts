import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../../ISlashCommand";

const giveawayDeleteCommand: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("giveaway-delete")
        .setDescription("Delete a giveaway")
        .addIntegerOption(option =>
        option.setName("giveaway_id")
            .setDescription("The ID of the giveaway to delete")
            .setRequired(true)),
    serverOnly: true,
    async execute(interaction) {
        // Delete a giveaway by ID
    }
        
}

export { giveawayDeleteCommand };

