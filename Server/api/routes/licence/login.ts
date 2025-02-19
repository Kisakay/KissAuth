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

import { BaseGuildTextChannel, EmbedBuilder } from "discord.js";
import { bot } from "../../../index.js";
import { Database } from "../../../shared/database.js";
import { CheckLicense } from "../../../shared/func/checkLicense.js";
import { ServerRoute } from "../../../types/ServerRoute.js";
import { config } from "../../../config.example.js";

export const route: ServerRoute = {
    path: "/license/login",
    method: "post",

    async evaluate(req, res) {
        const {
            key,
            ip,
            adminKey
        } = req.body;

        if (!key || !ip || !adminKey) {
            return res.status(400).json({
                error: "Missing parameters"
            });
        }

        // Check if the key already exists
        const license_table = Database.table("license");
        const isExist = await license_table.get(`key.${key}`) !== undefined;

        if (!isExist) {
            return res.status(400).json({
                error: "Key doesn't exist"
            });
        }

        // Check the license
        let state = await CheckLicense(key, ip);

        if (state.error) {
            return res.status(400).json({
                error: state.error
            });
        }

        let client = bot.getClient();

        let embed = new EmbedBuilder()
            .setTitle("Server ~:")
            .setColor("#008000")
            .setDescription(`A key has use for login\`\`\`${key}\`\`\`This IPV4 is **${state.ip}**`)
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.channel_log_id) as BaseGuildTextChannel).send({ embeds: [embed] });

        return res.json({
            success: true
        });
    }
}