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
import { config } from "../../../config.js";
import { bot } from "../../../index.js";
import { Database } from "../../../shared/database.js";
import { CreateLicense } from "../../../shared/func/createLicense.js";
import { ServerRoute } from "../../../types/ServerRoute.js";

export const route: ServerRoute = {
    path: "/license/create",
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

        // Check if the admin key is correct
        if (adminKey !== config.server.server_authorizations) {
            return res.status(403).json({
                error: "Invalid admin key"
            });
        }

        // Check if the key already exists
        const license_table = Database.table("license");
        const isExist = await license_table.get(`key.${key}`) !== undefined;

        if (isExist) {
            return res.status(400).json({
                error: "Key already exists"
            });
        }

        // Create the license
        let state = await CreateLicense(key, ip);

        if (state.error) {
            return res.status(400).json({
                error: state.error
            });
        }

        let client = bot.getClient();

        let embed = new EmbedBuilder()
            .setTitle("Server ~:")
            .setColor("#008000")
            .setDescription(`A key has created\`\`\`${key}\`\`\`This IPV4 is **${ip}**`)
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.channel_log_id) as BaseGuildTextChannel).send({ embeds: [embed] });

        return res.json({
            success: true
        });
    }
}