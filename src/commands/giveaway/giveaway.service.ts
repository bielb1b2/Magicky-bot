import { DateTime } from 'luxon';
import { IRegisteredDraws, registeredDraws } from './registered-draws'
import { client } from '../../clientconfig';
import { TextChannel } from 'discord.js';

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

    gamesOfTheDay.forEach(item => {
        const winners: string[] = [];
        let participants = item.giveawayInfo.participants;
        if (participants.length > 0) {
            for (let index = 0; index < Number(item.giveawayInfo.winners); index++) {
                const winner = getRandomElement(participants);
                winners.push(winner);
                participants = participants.filter(participant => participant !== winner);
            }
            const channel = client.channels.cache.get(item.guildInfo.channelId) as TextChannel;
            if (channel) {
                channel.send(`Congratulations ${winners.map(winner => `<@${winner}>`).join(', ')}! You have won the giveaway for "${item.giveawayInfo.title}"!`);
            }
        } else {
            const channel = client.channels.cache.get(item.guildInfo.channelId) as TextChannel;
            if (channel) {
                channel.send(`No participants for giveaway: "${item.giveawayInfo.title}"!`);
            }
        }
    });

    registeredDraws.length = 0;
}

function getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}