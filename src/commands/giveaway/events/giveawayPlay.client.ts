import { Events } from "discord.js";
import { client } from "../../../clientconfig";
import { registeredDraws } from "../repositorys/registered-draws";
import { endGiveaway } from "../services/giveaway.service";

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "run-giveaway-button") {
        const selectedGame = registeredDraws.find(item => item.id === interaction.message.id); 
        if (!selectedGame) {
            await interaction.reply({ content: "Giveaway not found!!!", options: { ephemeral: true } });
            return;
        }
        registeredDraws.splice(registeredDraws.indexOf(selectedGame), 1);

        endGiveaway(selectedGame);
    }
})