import { EmbedBuilder, ModalBuilder } from "@discordjs/builders";
import { ICommands } from "../interface/ICommands";
import { z } from "zod";
import dayjs from "dayjs";

const giveawaySchema = z.object({
    title: z.string(),
    description: z.string(),
    winners: z.string(),
    dayOfExecute: z.string(),
    hourOfExecute: z.string(),
});

type giveawaySchemaType = z.infer<typeof giveawaySchema>;

export = {
    name: 'giveaway',
    description: 'giveaway!',
    howUse: '!giveaway <title> <description> <winners> <dayOfExecute> <hourOfExecute>',
    async execute(interaction, args) {
        const giveawayConfig: giveawaySchemaType = {
            title: args[0],
            description: args[1],
            winners: args[2],
            dayOfExecute: args[3],
            hourOfExecute: args[4],
        }

        console.log(args)

        const parse = giveawaySchema.safeParse(giveawayConfig);

        if(!parse.data) {
            interaction.reply(`Info command: \`${this.howUse}\``);
            return;
        }

        const executionDate = dayjs(`${giveawayConfig.dayOfExecute}-${new Date().getFullYear()} ${giveawayConfig.hourOfExecute}:00`, 'DD-MM-YYYY HH:mm').toISOString();
        


        const message = new EmbedBuilder()
            .setTitle(giveawayConfig.title)
            .setDescription(giveawayConfig.description)
            .addFields([
                { name: 'Winners', value: giveawayConfig.winners.toString(), inline: true },
                { name: 'Execution Date', value: executionDate, inline: true },
            ])

        interaction.reply({ embeds: [message] });
    }
} as ICommands;
