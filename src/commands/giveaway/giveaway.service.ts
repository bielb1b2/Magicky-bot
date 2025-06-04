import { DateTime } from "luxon";
import { EmbedBuilder, TextChannel } from "discord.js";

import { IRegisteredDraws, registeredDraws } from "./registered-draws"
import { client } from "../../clientconfig";
import configBot from "../../config/configbot.json";

export async function cronGiveAway() {
    const gamesOfTheDay: IRegisteredDraws[] = [];

    const now = DateTime.now().set({ minute: 0, second: 0, millisecond: 0 });

    registeredDraws.forEach(item => {
        const executionDate = DateTime.fromISO(item.giveawayInfo.executionDate).set({ minute: 0, second: 0, millisecond: 0 });

        if(executionDate.equals(now)) {
            gamesOfTheDay.push(item);
        }
    })

    if(gamesOfTheDay.length === 0) {
        return;
    }

    gamesOfTheDay.forEach((item) => {
        const winners: string[] = [];
        let participants = item.giveawayInfo.participants;
        if (participants.length > 0) {
            for (let index = 0; index < Number(item.giveawayInfo.winners); index++) {
                const winner = getRandomElement(participants);
                if(winner === undefined) {
                    winners.push("Ins. Participants")
                } else {
                    winners.push(`${winner}`);
                }
                participants = participants.filter(participant => participant !== winner);
            }
            const channel = client.channels.cache.get(item.guildInfo.channelId) as TextChannel;
            if (channel) {

                const winnerEmbed = new EmbedBuilder()
                    .setColor("#7FDFFF")
                    .setTitle(item.giveawayInfo.title)
                    .setDescription(item.giveawayInfo.description)
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
            const channel = client.channels.cache.get(item.guildInfo.channelId) as TextChannel;
            if (channel) {
                channel.send(`No participants for giveaway: "${item.giveawayInfo.title}"!`);
            }
        }

        const drawIndex = registeredDraws.findIndex(draw => draw.id === item.id);
        if (drawIndex !== -1) {
            registeredDraws.splice(drawIndex, 1);
        }
    });

    gamesOfTheDay.length = 0;
}

function getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}