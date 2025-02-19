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
import { DeleteLicense } from "../../../shared/func/deleteLicense.js";
import { ServerRoute } from "../../../types/ServerRoute.js";
import { codes } from "../../codes.js";

export const route: ServerRoute = {
    path: "/license/delete",
    method: "post",

    async evaluate(req, res) {
        const {
            key,
            adminKey
        } = req.body;

        if (!key || !adminKey) {
            return res.status(codes[400].code).json(codes[400]);
        }

        // Check if the admin key is correct
        if (adminKey !== config.server.server_authorizations) {
            return res.status(codes[403].code).json(codes[403]);
        }

        // Check if the key already exists
        const license_table = Database.table("license");
        const isExist = await license_table.get(`key.${key}`) !== undefined;

        if (!isExist) {
            return res.status(codes[400].code).json(codes[400]);
        }

        // Create the license
        let state = await DeleteLicense(key);

        if (state.error) {
            return res.status(400).json({
                error: state.error
            });
        }

        let client = bot.getClient();

        let embed = new EmbedBuilder()
            .setTitle("[API] - License Deletion")
            .setColor("Aqua")
            .setFields(
                {
                    name: "License Key",
                    value: `||${key}||`,
                    inline: false
                }
            )
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.channel_log_id) as BaseGuildTextChannel).send({ embeds: [embed] });

        return res.status(200).json({
            success: true
        });
    }
}