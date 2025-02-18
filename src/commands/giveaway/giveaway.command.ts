import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { ButtonStyle, Events, MessageFlags } from "discord.js";
import { z } from "zod";
import { DateTime } from "luxon";

import { ICommands } from "../interface/ICommands";
import { registeredDraws } from "./registered-draws";
import { client } from "../../clientconfig";

const giveawaySchema = z.object({
    title: z.string().max(100),
    description: z.string().max(10000),
    winners: z.string(),
    dayOfExecute: z.string(),
    monthOfExecute: z.string(),
    hourOfExecute: z.string(),
});

type giveawaySchemaType = z.infer<typeof giveawaySchema>;

export = {
    name: "giveaway",
    description: "giveaway!",
    howUse: "!giveaway <title> <description> <winners> <dayOfExecute> <monthOfExecute> <hourOfExecute>",
    async execute(interaction, args) {
        if(!args) {
            interaction.reply("This command need arguments")
            return;
        }

        const giveawayConfig: giveawaySchemaType = {
            title: args[0],
            description: args[1],
            winners: args[2],
            dayOfExecute: args[3],
            monthOfExecute: args[4],
            hourOfExecute: args[5],
        }

        const parse = giveawaySchema.safeParse(giveawayConfig);

        if(!parse.data) {
            interaction.reply(`Info command: \`${this.howUse}\``);
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
        
        console.log("Giveaway", giveawayConfig);

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
} as ICommands;

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "giveaway-button") {
        const userId = interaction.user.id;

        const giveaway = registeredDraws.find(draw => draw.id === interaction.message.id);
        if(!giveaway) {
            await interaction.reply({ content: "Giveaway not found", flags: MessageFlags.Ephemeral  })
            return;
        }

        const userIsAlreadyInEvent = giveaway.giveawayInfo.participants.find(item => item === userId);
        if(userIsAlreadyInEvent) {
            await interaction.reply({ content: "You're already in event", flags: MessageFlags.Ephemeral  })
            return;
        }

        const joinButtonUpdated = new ButtonBuilder()
            .setCustomId("giveaway-button")
            .setLabel(`Participate (${giveaway.giveawayInfo.participants.length + 1})`)
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(joinButtonUpdated);


        giveaway.giveawayInfo.participants.push(userId);

        await interaction.message.edit({ components: [row] })
        await interaction.reply({ content: "Now you are in the event", flags: MessageFlags.Ephemeral });
    }
})
