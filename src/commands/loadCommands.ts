import { ISlashCommand } from "./ISlashCommand";

// Import all commands here
import { pingCommand } from "./utility/ping.command";
import { giveawayCommand } from "./giveaway/giveaway.command";
import { giveawayListCommand } from "./giveaway/giveaway-list.command";
import { reloadCommand } from "./utility/reload.command";

const slashCommands: ISlashCommand[] = [];

slashCommands.push(
    pingCommand,
    giveawayListCommand,
    giveawayCommand,
    reloadCommand
)

export { slashCommands };
