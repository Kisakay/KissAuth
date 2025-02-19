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

import { BaseGuildTextChannel, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../../../types/CommandsBot.js";
import { config } from "../../../config.js";
import { DeleteLicense } from "../../../shared/func/deleteLicense.js";

export const command: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Delete an license key of a client")
        .addStringOption((option) =>
            option
                .setName("key")
                .setDescription("the key you want to delete")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('password')
                .setDescription("The password to create the request")
                .setRequired(true)
        )
        .toJSON(),
    async evaluate(client, interaction) {
        var key = interaction.options.getString("key");
        var adminKey = interaction.options.getString("password");

        if (adminKey != config.bot.bot_password) {
            await interaction.reply({ content: "`[❌]` The password is not good :c", ephemeral: true });
            return;
        };

        const sltcv = new EmbedBuilder()
            .setTitle("Pending deletion...")
            .setDescription(`<@${interaction.user.id}> want to delete: \n\`\`\`${key}\`\`\``)
            .setColor("#000000")
            .setFooter({ text: 'by Kisakay', iconURL: client.user?.displayAvatarURL()! });

        await interaction.reply({ embeds: [sltcv], ephemeral: true });
        await interaction.followUp({ content: `**->** <#${config.channel_log_id}>`, ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle("Request to server...")
            .setColor("#000000")
            .setDescription(`A key is pending deletion by: <@${interaction.user.id}>\n\`\`\`${key}\`\`\``)
            .setFooter({ text: 'by Kisakay', iconURL: client.user?.displayAvatarURL()! })
            .setTimestamp();

        let channel = interaction.guild?.channels.cache.get(config.channel_log_id);
        (channel as BaseGuildTextChannel).send({ embeds: [embed] });

        await DeleteLicense(key);
    },
}