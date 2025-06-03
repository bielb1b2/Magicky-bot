import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord.js";
import { z } from "zod";
import { DateTime } from "luxon";

import { ICommands } from "../../interface/ICommands";
import { registeredDraws } from "./registered-draws";
import { messageEmbedError } from "./errors/invalidArgs.error";

interface IGiveawayArguments {
    title: string;
    description: string;
    winners: string;
    dayOfExecute: string;
    monthOfExecute: string;
    hourOfExecute: string;
}

const giveawaySchema = z.object({
    title: z.string().max(100),
    description: z.string().max(10000),
    winners: z.coerce.number().max(10).min(1),
    dayOfExecute: z.string(),
    monthOfExecute: z.string(),
    hourOfExecute: z.string(),
});

export const giveawayCommand: ICommands = {
    name: "giveaway",
    description: "giveaway!",
    howUse: "!giveaway `<title>` `<description>` `<winners>` `<dayOfExecute>` `<monthOfExecute>` `<hourOfExecute>`",
    example: "!giveaway \"Game Giveaway\" \"Participate to win a game!\" 1 15 10 14",
    async execute(interaction, args) {
        if(!args) {
            interaction.reply("This command need arguments")
            return;
        }

        if(registeredDraws.find(draw => draw.guildInfo.guildId === interaction.guildId)) {
            interaction.reply("There is already a giveaway registered for this server");
            return;
        }

        const giveawayConfig: IGiveawayArguments = {
            title: args[0],
            description: args[1],
            winners: args[2],
            dayOfExecute: args[3],
            monthOfExecute: args[4],
            hourOfExecute: args[5],
        }

        const parse = giveawaySchema.safeParse(giveawayConfig);

        if(!parse.data) {
            const errorEmbedMessage = messageEmbedError(parse)
            
            interaction.reply({ embeds: [errorEmbedMessage] });
            return;
        }

        const executionDate = DateTime.fromObject({
            year: DateTime.now().year,
            day: parseInt(giveawayConfig.dayOfExecute),
            month: parseInt(giveawayConfig.monthOfExecute),
            hour: parseInt(giveawayConfig.hourOfExecute),
        })

        if(executionDate < DateTime.now().setZone("America/Sao_Paulo").set({ minute: 0, second: 0, millisecond: 0 }) || !executionDate.isValid) {
            interaction.reply("Invalid date");
            return;
        }

        const joinButton = new ButtonBuilder()
            .setCustomId("giveaway-button")
            .setLabel("Participate")
            .setStyle(ButtonStyle.Primary)
        
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(joinButton);
        
        const message = new EmbedBuilder()
            .setTitle(giveawayConfig.title)
            .setDescription(giveawayConfig.description)
            .addFields([
                { name: "Winners", value: giveawayConfig.winners, inline: true },
                { name: "Execution Date", value: executionDate.toISODate(), inline: true },
            ])

        const response = await interaction.channel.send({ 
            embeds: [message], 
            components: [row],
        });

        registeredDraws.push({
            id: response.id,
            guildInfo: {
                guildId: response.guild!.id,
                messageId: response.id,
                channelId: response.channelId,
            },
            giveawayInfo: {
                title: giveawayConfig.title,
                description: giveawayConfig.description,
                winners: giveawayConfig.winners,
                executionDate: executionDate.toISO(),
                participants: [],
            }
        })
    }
}
