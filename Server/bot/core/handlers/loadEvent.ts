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
import { BotEvent } from "../../../types/BotEvent.js";

import path from "node:path";
import fs from "node:fs";

export default async (client: Client) => {
    const eventsDir = path.join(process.cwd(), "dist/bot/events");
    const eventsFolder = fs.readdirSync(eventsDir);

    for (const category of eventsFolder) {
        const categoryPath = path.join(eventsDir, category);

        if (!fs.lstatSync(categoryPath).isDirectory()) {
            continue;
        }

        const categoryFolder = fs.readdirSync(categoryPath);

        categoryFolder.filter(file => file.endsWith('.js'));

        for (const file of categoryFolder) {
            const eventPath = path.join(categoryPath, file);
            const { event } = await import(eventPath);

            if ('name' in event && 'once' in event && 'evaluate' in event) {
                const evt = event as BotEvent;

                if (evt.once) {
                    client.once(evt.name, async (...args) => await evt.evaluate(client, ...args));
                } else {
                    client.on(evt.name, async (...args) => await evt.evaluate(client, ...args));
                }
            }
        }
    }
}