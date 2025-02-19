/*

▗▖ ▗▖▄  ▄▄▄  ▄▄▄  ▗▄▖ █  ▐▌   ■  ▐▌   
▐▌▗▞▘▄ ▀▄▄  ▀▄▄  ▐▌ ▐▌▀▄▄▞▘▗▄▟▙▄▖▐▌   
▐▛▚▖ █ ▄▄▄▀ ▄▄▄▀ ▐▛▀▜▌       ▐▌  ▐▛▀▚▖
▐▌ ▐▌█           ▐▌ ▐▌       ▐▌  ▐▌ ▐▌
                             ▐▌       
    ・ Project under MIT License
    ・ Made by: @Kisakay
    ・ Repository: https://github.com/Kisakay/KissAuth
*/

import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../../../types/CommandsBot.js";
import { config } from "../../../config.js";
import { Database } from "../../../shared/database.js";

export const command: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("list_all")
        .setDescription("Check all license in the database")
        .addStringOption((option) =>
            option
                .setName('password')
                .setDescription("The password to create the request")
                .setRequired(true)
        )
        .toJSON(),
    async evaluate(client, interaction) {
        var adminKey = interaction.options.getString('password');

        if (adminKey != config.bot.bot_password) {
            await interaction.reply({ content: "`[❌]` The password is not good :c", ephemeral: true });
            return;
        };

        let license_table = Database.table("license");
        let o = await license_table.get('key') || 'None';

        let buffer = Buffer.from(o, 'utf-8');
        let attachment = new AttachmentBuilder(buffer, { name: 'all.txt' })

        await interaction.reply({ files: [attachment], ephemeral: false, content: interaction.user.toString() });
    },
}