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

import { printer } from "../../../index.js";
import { BotEvent } from "../../../types/BotEvent.js";

export const event: BotEvent = {
    name: "ready",
    once: false,

    async evaluate(client) {
        printer.legacy("[".green + "BOT".blue + "]".green + " KissAuth Bot logged as " + client.user?.tag + "\n".gray + `Invite Link: https://discord.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot&permissions=0`.gray);
    }
}