import { Message, OmitPartialGroupDMChannel } from "discord.js"

export type ICommands = {
    name: string,
    description: string,
    execute<T>(interaction: OmitPartialGroupDMChannel<Message<boolean>>, args: any): T
}