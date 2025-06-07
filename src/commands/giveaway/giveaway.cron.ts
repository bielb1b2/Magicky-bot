import { DateTime } from "luxon";

import { endGiveaway } from "./giveaway.service";
import { gamesOfTheDay, registeredDraws } from "./registered-draws";

export async function cronGiveAway() {
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
        endGiveaway(item);
    });

    gamesOfTheDay.length = 0;
}