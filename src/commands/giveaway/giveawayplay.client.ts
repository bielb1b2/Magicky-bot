import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, MessageFlags } from "discord.js";
import { client } from "../../clientconfig";
import { registeredDraws } from "./registered-draws";
import { cronGiveAway } from "./giveaway.service";

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "run-giveaway-button") {
        cronGiveAway();
    }
})