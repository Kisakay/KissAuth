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

import { Client } from "discord.js";
import { printer } from "../../../index.js";
import { BotCommand } from "../../../types/CommandsBot.js";

import path from "node:path";
import fs from "node:fs";

export default async (client: Client) => {
    const commandsDir = path.join(process.cwd(), "dist/bot/commands");
    const commandsFolder = fs.readdirSync(commandsDir);

    for (const category of commandsFolder) {
        const categoryPath = path.join(commandsDir, category);

        if (!fs.lstatSync(categoryPath).isDirectory()) {
            continue;
        }

        const categoryFolder = fs.readdirSync(categoryPath);

        categoryFolder.filter(file => file.endsWith('.js'));

        for (const file of categoryFolder) {
            const commandPath = path.join(categoryPath, file);
            const { command } = await import(commandPath);

            if ('data' in command && 'evaluate' in command) {
                const cmd = command as BotCommand;

                client.commands.set(cmd.data.name, cmd);
            } else {
                printer.warn(`[WARNING SIDE:BOT] The ${command.data.name}'s commands is missing a required "data" or "execute" property.`.red)
            }
        }
    }
}