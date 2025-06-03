import { ICommands } from "../interface/ICommands";

import { giveawayCommand } from "./giveaway/giveaway.command";
import { ping } from "./ping/ping.command";

const commands: ICommands[] = []; 

commands.push(giveawayCommand);
commands.push(ping)

console.log("Commands Loaded: ", commands.map(command => command.name).join(", "));

export { commands };