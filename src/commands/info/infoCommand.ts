import { ICommands } from "../../interface/ICommands";
import { Colors, EmbedBuilder, Message, OmitPartialGroupDMChannel } from "discord.js"

export const infoCommand = {
    name: "info",
    description: "Obtain information about all commands in this bot",
    howUse: "!info [command] or !info",
    execute(interaction: OmitPartialGroupDMChannel<Message<boolean>>, args: string[], commands: ICommands[]) {
        if(args.length === 0) {
            const commandList = commands.map((command: ICommands) => command.name).join("\n");
            const embedMessage = new EmbedBuilder()
                .setTitle("All Commands")
                .setColor(Colors.Aqua)
                .addFields({
                    name: "Commands", value: commandList
                })

            interaction.reply({ embeds: [embedMessage] });
        } else {
            const command = commands.find((command: ICommands) => command.name === args[0]);
            if(command) {
                interaction.reply(`Command: ${command.name}\nDescription: ${command.description}\nHow to use: ${command.howUse}`);
            } else {
                interaction.reply("Command not found");
            }
        }
    }
}