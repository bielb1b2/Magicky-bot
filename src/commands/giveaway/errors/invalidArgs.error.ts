import { Colors, EmbedBuilder } from "discord.js";
import { z } from "zod";

export function messageEmbedError(parse: z.SafeParseError<unknown>): EmbedBuilder {
    const messageError = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Error")
        .setDescription("Invalid Args")

    parse.error.errors.forEach((errorArg) => {
        messageError.addFields([
            { name: `[${errorArg.path[0].toString()}]`, value: errorArg.message }
        ])
    })


    return messageError;
} 