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
import { generatePassword } from "ihorizon-tools";
import { config } from "../../../config.js";
import { CreateLicense } from "../../../shared/func/createLicense.js";

export const command: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Create an license key for an client")
        .addStringOption((option) =>
            option
                .setName("ip")
                .setDescription("the ip adress of the customer")
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
        var ip = interaction.options.getString("ip") as string;
        var adminKey = interaction.options.getString("password") as string;

        let ipv4_regex = /(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d{1})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d{1})/g;

        if (adminKey != config.bot.bot_password) {
            await interaction.reply({ content: "`[❌]` The password is not good :c", ephemeral: true });
            return;
        };

        if (!ipv4_regex.test(ip) && ip !== 'localhost') {
            await interaction.reply({ content: "`[❌]` The IPv4 is not in good format :c", ephemeral: true });
            return;
        }

        var key = generatePassword({ length: 122, symbols: false });

        await interaction.reply({
            content: "Key in creation...",
            ephemeral: true
        });
        await interaction.followUp({ content: `**->** <#${config.channel_log_id}>`, ephemeral: true });

        let embed = new EmbedBuilder()
            .setTitle("Request to server...")
            .setColor("#000000")
            .setDescription(`A new key is for waiting by <@${interaction.user.id}>\n\`\`\`${key}\`\`\`IPV4: **${ip}**`)
            .setFooter({ text: 'by Kisakay', iconURL: client.user?.displayAvatarURL()! })
            .setTimestamp();

        let channel = interaction.guild?.channels.cache.get(config.channel_log_id);

        (channel as BaseGuildTextChannel).send({ embeds: [embed] });

        await CreateLicense(key, ip);
        return;
    },
}