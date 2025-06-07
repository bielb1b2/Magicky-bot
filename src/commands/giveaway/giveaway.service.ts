import { EmbedBuilder, TextChannel } from "discord.js";
import { DateTime } from "luxon";

import { client } from "../../clientconfig";
import configBot from "../../config/configbot.json";
import { IRegisteredDraws } from "./registered-draws";

export async function endGiveaway(draw: IRegisteredDraws) {
    const winners: string[] = [];
    let participants = draw.giveawayInfo.participants;
    if (participants.length > 0) {
        for (let index = 0; index < Number(draw.giveawayInfo.winners); index++) {
            const winner = getRandomElement(participants);
            if(winner === undefined) {
                winners.push("Ins. Participants")
            } else {
                winners.push(`${winner}`);
            }
            participants = participants.filter(participant => participant !== winner);
        }
        const channel = client.channels.cache.get(draw.guildInfo.channelId) as TextChannel;
        if (channel) {
            const winnerEmbed = new EmbedBuilder()
                .setColor("#7FDFFF")
                .setTitle(draw.giveawayInfo.title)
                .setDescription(draw.giveawayInfo.description)
                .setThumbnail(configBot.urlPhoto)
                .addFields(
                    { name: "Schedule execute", value: DateTime.now().toFormat("dd LLL yyyy") },
                    { name: "\u200B", value: "\u200B" },

                )

            winners.map((winner, index) => {
                winnerEmbed.addFields(
                    { name: `Winner ${index + 1}`, value: `<@${winner}>`, inline: true }
                )
            })

            channel.send({
                embeds: [winnerEmbed]
            });
        }
    } else {
        const channel = client.channels.cache.get(draw.guildInfo.channelId) as TextChannel;
        if (channel) {
            channel.send(`No participants for giveaway: "${draw.giveawayInfo.title}"!`);
        }
    }

    return;
}

function getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}