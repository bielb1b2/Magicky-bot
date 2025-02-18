import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    DISCORD_TOKEN: z.string({ message: "Required [DISCORD_TOKEN] env" })
})

const envLoad = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN
}

export const env = envSchema.safeParse(envLoad)