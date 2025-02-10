import { ICommands } from "./interface/ICommands";

export = {
    name: 'ping',
    description: 'Ping!',
    execute(interaction, args) {
        interaction.reply('Pong!');
    },
} as ICommands;