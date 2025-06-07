export interface IRegisteredDraws {
    id: string,
    guildInfo: {
        guildId: string,
        messageId: string,
        channelId: string,
    },
    giveawayInfo: {
        title: string,
        description: string,
        winners: string,
        executionDate: string,
        participants: string[],
    }
}

export const registeredDraws: IRegisteredDraws[] = []
export const gamesOfTheDay: IRegisteredDraws[] = [];
