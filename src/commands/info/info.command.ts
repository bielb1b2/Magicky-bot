import { ICommands } from "../../interface/ICommands";
import { Colors, EmbedBuilder, Message, OmitPartialGroupDMChannel } from "discord.js"

export const infoCommand = {
    name: "info",
    description: "Obtain information about all commands in this bot",
    howUse: "!info [command] or !info",
    example: "!info `ping`",
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
                const embedMessage = new EmbedBuilder()
                    .setTitle(`Command: ${command.name}`)
                    .setColor(Colors.Aqua)
                    .addFields(
                        { name: "Description", value: command.description },
                        { name: "How to use", value: command.howUse },
                        { name: "Example", value: command.example }
                    );

                interaction.reply({ embeds: [embedMessage] });
            } else {
                interaction.reply("Command not found");
            }
        }
    }
}