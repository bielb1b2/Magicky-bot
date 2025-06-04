import { Routes, SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../ISlashCommand";
import { rest } from "../../clientconfig";
import { slashCommands } from "../loadCommands";

const reloadCommand: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("reload-commands")
        .setDescription("Restarts the bot and reloads all commands."),
    async execute(interaction) {
        console.log("Commands:", interaction.toJSON())
        await rest.put(
            Routes.applicationCommands("1338318534660329552"),
            { body: slashCommands.map(command => command.data) }
        );

        await interaction.reply("Commands reloaded successfully! The bot will restart now.");
    }
}

export { reloadCommand };