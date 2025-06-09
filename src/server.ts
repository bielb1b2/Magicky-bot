import { client, rest } from "./clientconfig";
import { env } from "./env/index";

import "./commands/giveaway/events/giveawayControl.client";
import "./commands/giveaway/events/giveawayPlay.client";

if(env.error) {
    env.error.errors.forEach(item => {
        console.error(item.message)
    })

    throw new Error("Stop Bot!")
}

rest.setToken(env.data.DISCORD_TOKEN);
client.login(env.data.DISCORD_TOKEN);