import { Events } from "discord.js";
import { client } from "../../clientconfig";
import { cronGiveAway } from "./giveaway.service";

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "run-giveaway-button") {
        cronGiveAway();
    }
})