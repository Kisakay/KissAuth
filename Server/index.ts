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

import { logger } from "ihorizon-tools";
import { Server } from "./api/server.js";
import { Bot } from "./bot/bot.js";

export const printer = logger;

printer.legacy("[".gray + "PROCESS".blue + "]".gray + " KissAuth process starting...");

const server = new Server();
const bot = new Bot();

process.on("uncaughtException", (err) => {
    printer.err("[".gray + "ERROR".red + "]".gray + " Uncaught Exception: " + err);
})

process.on("unhandledRejection", (err) => {
    printer.err("[".gray + "ERROR".red + "]".gray + " Unhandled Rejection: " + err);
})

export { server, bot };