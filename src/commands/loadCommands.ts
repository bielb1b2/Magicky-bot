import { ISlashCommand } from "./ISlashCommand";

// Import all commands here
import { giveawayCommand } from "./giveaway/commands/giveaway-create.command";
import { giveawayListCommand } from "./giveaway/commands/giveaway-list.command";
import { pingCommand } from "./utility/ping.command";
import { reloadCommand } from "./utility/reload.command";

const slashCommands: ISlashCommand[] = [];

slashCommands.push(
    pingCommand,
    giveawayListCommand,
    giveawayCommand,
    reloadCommand
)

export { slashCommands };
