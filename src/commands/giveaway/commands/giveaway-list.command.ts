import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../../ISlashCommand";
import { registeredDraws } from "../repositorys/registered-draws";

const giveawayListCommand: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("giveaway-list")
        .setDescription("List all giveaways"),
    serverOnly: true,
    async execute(interaction) {
        const allDraws = registeredDraws.filter(item => item.guildInfo.guildId === interaction.guildId);

        if(allDraws.length <= 0) {
            await interaction.reply("No giveaway created yet")
        }

        const embedMessage = new EmbedBuilder()
            .setTitle(`All giveaways: ${interaction.guild?.name}`)
            .setDescription("Show all giveaways that was not played in server yet")
            .setColor(Colors.Aqua)


        allDraws.forEach((item, index) => {
            embedMessage.addFields(
                { name: `#${index++} ${item.giveawayInfo.title}`, value: item.giveawayInfo.description }
            )
        })

        await interaction.reply({
            embeds: [embedMessage]
        })

        return
    }
}

export { giveawayListCommand };

