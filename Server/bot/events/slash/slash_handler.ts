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

import { Client, Interaction } from "discord.js";
import { BotEvent } from "../../../types/BotEvent.js";
import { config } from "../../../config.js";

export const event: BotEvent = {
    name: "interactionCreate",
    once: false,

    async evaluate(client: Client, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        if (!config.permission.white_list.includes(interaction.user.id)
            || interaction.guild?.id !== config.guild_id
            || interaction.channelId !== config.channel_id) {

            await interaction.reply({ content: "`[❌]`", ephemeral: true });
            return;
        }

        let cmd = client.commands.get(interaction.commandName);

        if (!cmd) return

        cmd.evaluate(client, interaction)
    }
}