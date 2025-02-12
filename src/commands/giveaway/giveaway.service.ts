import { DateTime } from 'luxon';
import { IRegisteredDraws, registeredDraws } from './registered-draws'
import { client } from '../../clientconfig';

export async function cronGiveAway() {
    const gamesOfTheDay: IRegisteredDraws[] = [];

    const now = DateTime.now().set({ minute: 0, second: 0, millisecond: 0 });
    console.log("now", now);
    console.log("Registered Draws", registeredDraws);

    registeredDraws.forEach(item => {
        const executionDate = DateTime.fromISO(item.giveawayInfo.executionDate).set({ minute: 0, second: 0, millisecond: 0 });



        if(executionDate.equals(now)) {
            gamesOfTheDay.push(item);
        }
    })

    gamesOfTheDay.forEach(item => {
        
    })
}