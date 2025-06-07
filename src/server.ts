import { env } from "./env/index";
import { client, rest } from "./clientconfig";

import "./commands/giveaway/giveawaycontrol.client";
import "./commands/giveaway/giveawayplay.client";

if(env.error) {
    env.error.errors.forEach(item => {
        console.error(item.message)
    })

    throw new Error("Stop Bot!")
}

rest.setToken(env.data.DISCORD_TOKEN);
client.login(env.data.DISCORD_TOKEN);