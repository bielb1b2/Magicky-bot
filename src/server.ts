import { env } from "./env/index";
import { client } from "./clientconfig";

if(env.error) {
    env.error.errors.forEach(item => {
        console.error(item.message)
    })

    throw new Error("Stop Bot!")
}

client.login(env.data.DISCORD_TOKEN)