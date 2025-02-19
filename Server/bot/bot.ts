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

import {
    Client,
    EmbedBuilder,
    Partials,
    GatewayIntentBits,
    Collection,
    REST,
    Routes,
    ApplicationCommandType,
    ApplicationCommand,
} from "discord.js";

import fs from 'fs';
import path from 'path';
import { printer } from "../index.js";
import { config } from "../config.js";

class Bot {
    private client: Client;

    constructor() {
        printer.legacy("[".gray + "BOT".blue + "]".gray + " KissAuth Bot side starting...");

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent
            ], partials: [
                Partials.Message,
                Partials.Channel,
                Partials.Reaction,
                Partials.User,
            ]
        });

        this.client.commands = new Collection();

        this.setup();
    }

    private async setup() {
        await this.loadHandlers();
        await this.login();
        await this.writeSlashCommand();
    }

    private async loadHandlers() {
        let handlerPath = path.join(process.cwd(), 'dist', 'bot', 'core', 'handlers');
        let handlerFiles = (fs.readdirSync(handlerPath)).filter(file => file.endsWith('.js'));

        for (const file of handlerFiles) {
            const { default: handlerFunction } = await import(`${handlerPath}/${file}`);
            if (handlerFunction && typeof handlerFunction === 'function') {
                await handlerFunction(this.client);
            }
        }
    }

    private async writeSlashCommand() {
        try {
            const rest = new REST().setToken(this.client.token!);

            const data = await rest.put(
                Routes.applicationCommands(this.client.user?.id!),
                {
                    body: this.client.commands?.map((command) => ({
                        name: command.data.name,
                        description: command.data.description,
                        options: command.data.options || [],
                        type: ApplicationCommandType.ChatInput
                    }))
                },
            )
            printer.legacy("[".green + "BOT".blue + "]".green + ` Successfully reloaded ${(data as unknown as ApplicationCommand<{}>[]).length} application (/) commands.`);

        } catch (err) {
            printer.err(`[ERROR SIDE:BOT] ${err}`);
        }
    }

    private login(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.login(config.bot.bot_token)
                .then(token => {
                    printer.legacy("[".gray + "BOT".blue + "]".gray + " Bot successfully logged in!");
                    resolve(token);
                })
                .catch((err) => {
                    printer.err(`[ERROR SIDE:BOT] ${err}`);
                    reject(err);
                });
        });
    }

    public getClient(): Client {
        return this.client;
    }
}

export {
    Bot
}