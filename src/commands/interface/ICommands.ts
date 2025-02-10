import { Message, OmitPartialGroupDMChannel } from "discord.js"

export type ICommands = {
    name: string,
    description: string,
    howUse: string,
    execute<T>(interaction: OmitPartialGroupDMChannel<Message<boolean>>, args: string[]): T
}