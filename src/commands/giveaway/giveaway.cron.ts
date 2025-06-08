import { DateTime } from "luxon";

import { endGiveaway } from "./giveaway.service";
import { registeredDraws } from "./registered-draws";

export async function cronGiveAway() {
    const now = DateTime.fromISO(DateTime.now().set({ minute: 0, second: 0, millisecond: 0 }).setZone("America/Sao_Paulo").toString());

    registeredDraws.forEach((item) => {
        const executionDate = DateTime.fromISO(item.giveawayInfo.executionDate).set({ minute: 0, second: 0, millisecond: 0 });

        if(executionDate.equals(now)) {
            endGiveaway(item);
            registeredDraws.splice(registeredDraws.indexOf(item), 1);
        }
    })
}