import { Message, OmitPartialGroupDMChannel } from "discord.js"

export type ICommands = {
    name: string,
    description: string,
    howUse: string,
    example: string,
    rateLimit: number,
    execute(interaction: OmitPartialGroupDMChannel<Message<boolean>>, args?: string[]): Promise<void>
}