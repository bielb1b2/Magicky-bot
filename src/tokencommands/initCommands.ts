import { ICommands } from "../interface/ICommands";

import { giveawayCommand } from "./giveaway/giveaway.command";

const commands: ICommands[] = []; 

commands.push(giveawayCommand);

console.log("Commands Loaded: ", commands.map(command => command.name).join(", "));

export { commands };