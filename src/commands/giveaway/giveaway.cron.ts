import { DateTime } from "luxon";

import { endGiveaway } from "./giveaway.service";
import { registeredDraws } from "./registered-draws";

export function cronGiveAway() {
    if(registeredDraws.length === 0) {
        return;
    }

    const now = DateTime.fromISO(DateTime.now().set({ minute: 0, second: 0, millisecond: 0 }).setZone("America/Sao_Paulo").toString());

    const toExecute = registeredDraws.filter(item => {
        const executionDate = DateTime.fromISO(item.giveawayInfo.executionDate).set({ minute: 0, second: 0, millisecond: 0 });
        return executionDate.equals(now);
    });

    toExecute.forEach(item => endGiveaway(item));

    for (const item of toExecute) {
        const idx = registeredDraws.indexOf(item);
        if (idx !== -1) registeredDraws.splice(idx, 1);
    }

}