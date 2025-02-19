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
import { CheckLicense } from "../../../shared/func/checkLicense.js";

export const command: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription("Check an license key of a client")
        .addStringOption((option) =>
            option
                .setName("key")
                .setDescription("the key you want to check")
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
        var key = interaction.options.getString('key');
        var adminKey = interaction.options.getString('password');

        if (adminKey != config.bot.bot_password) {
            await interaction.reply({ content: "`[❌]` The password is not good :c", ephemeral: true });
            return;
        };

        let sltcv = new EmbedBuilder()
            .setTitle("Pending check...")
            .setDescription(`<@${interaction.user.id}> want to check key: \n\`\`\`${key}\`\`\``)
            .setColor("#000000")
            .setFooter({ text: 'by Kisakay', iconURL: client.user?.displayAvatarURL()! });

        await interaction.reply({ embeds: [sltcv], ephemeral: true });
        await interaction.followUp({ content: `**->**See Logs Here <#${config.channel_log_id}>`, ephemeral: true })

        let embed = new EmbedBuilder()
            .setTitle("Request to server...")
            .setColor("#000000")
            .setDescription(`A key is check by: <@${interaction.user.id}>\n\`\`\`${key}\`\`\``)
            .setFooter({ text: 'by Kisakay', iconURL: client.user?.displayAvatarURL()! })
            .setTimestamp();

        let channel = interaction.guild?.channels.cache.get(config.channel_log_id);
        (channel as BaseGuildTextChannel).send({ embeds: [embed] });

        let state = await CheckLicense(key);

        if (state.error) {
            await interaction.reply({ content: ':x: **The key is not in the database !**' });
            return;
        };

        let embed2 = new EmbedBuilder()
            .setTitle(`Finnish! - Verified`)
            .setColor("#3b722e")
            .setDescription(`A key is check by: <@${interaction.user.id}>\n\`\`\`${state.key}\`\`\`This IPV4 is **${state.ip}**`)
            .setFooter({ text: 'by Kisakay', iconURL: client.user?.displayAvatarURL()! })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed2] });
        return;
    },
}