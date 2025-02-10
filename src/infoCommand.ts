import { ICommands } from "./commands/interface/ICommands";
import { Message, OmitPartialGroupDMChannel } from "discord.js"

export = {
    name: 'info',
    description: 'Obtain information about all commands in this bot',
    howUse: '!info [command] or !info',
    execute(interaction: OmitPartialGroupDMChannel<Message<boolean>>, args: any, commands: ICommands[]) {
        if(args.length === 0) {
            const commandList = commands.map((command: ICommands) => command.name).join('\n');
            interaction.reply(`List of commands: \n${commandList}`);
        } else {
            const command = commands.find((command: ICommands) => command.name === args[0]);
            if(command) {
                interaction.reply(`Command: ${command.name}\nDescription: ${command.description}\nHow to use: ${command.howUse}`);
            } else {
                interaction.reply('Command not found');
            }
        }
    }
};