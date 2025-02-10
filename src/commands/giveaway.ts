import { ICommands } from "./interface/ICommands";

export = {
    name: 'giveaway',
    description: 'giveaway!',
    howUse: '!giveaway',
    execute(interaction, args) {
        interaction.reply('Pong!');
    },
} as ICommands;