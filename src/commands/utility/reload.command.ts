import { Routes, SlashCommandBuilder } from "discord.js";
import { rest } from "../../clientconfig";
import { ISlashCommand } from "../ISlashCommand";
import { slashCommands } from "../loadCommands";

const reloadCommand: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("reload-commands")
        .setDescription("Restarts the bot and reloads all commands."),
    async execute(interaction) {
        await rest.put(
            Routes.applicationCommands("1338318534660329552"),
            { body: slashCommands.map(command => command.data) }
        );
        
        if(interaction.user.id !== "211612940191793153") {
            await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });  
            await interaction.followUp({ content: "Only the bot owner can use this command." });
            return;
        }

        await interaction.reply("Commands reloaded successfully! The bot will restart now.");
    }
}

export { reloadCommand };
