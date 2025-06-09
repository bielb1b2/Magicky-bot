import { DateTime } from "luxon";

import { endGiveaway } from "./giveaway.service";
import { registeredDraws } from "./registered-draws";

export function cronGiveAway() {
    if(registeredDraws.length === 0) {
        return;
    }

    const now = DateTime.fromISO(DateTime.now().set({ minute: 0, second: 0, millisecond: 0 }).setZone("America/Sao_Paulo").toString());

    for (let index = registeredDraws.length - 1; index >= 0; index--) {
        const item = registeredDraws[index];
        const executionDate = DateTime.fromISO(item.giveawayInfo.executionDate).set({ minute: 0, second: 0, millisecond: 0 });
        console.log(`${index}`, DateTime.now())
        if(executionDate.equals(now)) {
            endGiveaway(item);
            registeredDraws.splice(registeredDraws.indexOf(item), 1);
        }
    }

}