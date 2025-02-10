import { ICommands } from "./interface/ICommands";

export = {
    name: 'ping',
    description: 'Ping!',
    howUse: '!ping',
    execute(interaction, args) {
        interaction.reply('Pong!');
    },
} as ICommands;