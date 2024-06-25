import {
    Client,
    EmbedBuilder,
    Partials,
    GatewayIntentBits,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Collection,
    Events,
    REST,
    Routes,
    ApplicationCommandType,
    ApplicationCommand,
    BaseGuildTextChannel
} from "pwss";

import rateLimit from "express-rate-limit";
import { logger } from "ihorizon-tools";
import express from 'express';

import { config } from './config';
import code from './Routes/code';

let client = new Client({
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

var app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 25,
    standardHeaders: true
});

app.use(limiter);
app.use(express.json({ limit: "500mb" }));

app.post('/api/json', (req, res) => {
    code(req, res, client);
});

app.listen(config.server.server_port, () => {
    logger.log(`Listening on port :${config.server.server_port}`);
});

client.commands = new Collection();

client.on('ready', () => {
    logger.log(`https://discord.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot&permissions=0`.gray);
    logger.log(`Logged as ${client.user?.tag}`.green);
});

export const generateKey = (length: number) => [...Array(length)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62))).join('');

const commands = [
    {
        data: new SlashCommandBuilder()
            .setName("create")
            .setDescription("Create an licence key for an client")
            .addStringOption((option) =>
                option
                    .setName("ip")
                    .setDescription("the ip adress of the customer")
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName('admin_key')
                    .setDescription("The admin password to really create the request")
                    .setRequired(true)
            ),
        async run(client: Client, interaction: ChatInputCommandInteraction) {
            var ip = interaction.options.getString("ip")
            var adminKey = interaction.options.getString("admin_key")

            if (adminKey != config.bot.bot_password) {
                interaction.reply("the admin token is not good :c");
                return;
            };

            var keyy = generateKey(400);

            let sltcv = new EmbedBuilder()
                .setTitle("Key in creation")
                .setDescription(`<@${interaction.user.id}> create: \n\`\`\`${keyy}\`\`\``)
                .setColor("#000000")
                .setFooter({ text: 'by Kisakay' });

            interaction.reply({ embeds: [sltcv] });
            interaction.channel?.send(`**->** <#${config.channel_log_id}>`);

            let embed = new EmbedBuilder()
                .setTitle("Request to server...")
                .setColor("#000000")
                .setDescription(`A new key is for waiting by <@${interaction.user.id}>\n\`\`\`${keyy}\`\`\`IPV4: **${ip}**`)
                .setFooter({ text: "by Kisakay" })
                .setTimestamp();

            let channel = interaction.guild?.channels.cache.get(config.channel_log_id);

            (channel as BaseGuildTextChannel).send({ embeds: [embed] });

            fetch(`http://${config.server.server_url}:${config.server.server_port}/api/json`, {
                method: 'POST',
                body: JSON.stringify({
                    adminKey: config.server.server_authorizations,
                    ip: ip,
                    key: keyy,
                    tor: 'CREATE_KEY'
                }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });

            return;
        },
    },
    {
        data: new SlashCommandBuilder()
            .setName("delete")
            .setDescription("Delete an licence key of a client")
            .addStringOption((option) =>
                option
                    .setName("key")
                    .setDescription("the key you want to delete")
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName('admin_key')
                    .setDescription("The admin password to really create the request")
                    .setRequired(true)
            ),
        async run(client: Client, interaction: ChatInputCommandInteraction) {
            var key = interaction.options.getString("key");
            var adminKey = interaction.options.getString("admin_key");

            if (adminKey != config.bot.bot_password) {
                interaction.channel?.send("the admin token is not good :c");
                return;
            };

            const sltcv = new EmbedBuilder()
                .setTitle("Pending deletion...")
                .setDescription(`<@${interaction.user.id}> want to delete: \n\`\`\`${key}\`\`\``)
                .setColor("#000000")
                .setFooter({ text: 'by Kisakay' });

            interaction.reply({ embeds: [sltcv] });
            interaction.channel?.send(`**->** <#${config.channel_log_id}>`);

            const embed = new EmbedBuilder()
                .setTitle("Request to server...")
                .setColor("#000000")
                .setDescription(`A key is pending deletion by: <@${interaction.user.id}>\n\`\`\`${key}\`\`\``)
                .setFooter({ text: "by Kisakay" })
                .setTimestamp();

            let channel = interaction.guild?.channels.cache.get(config.channel_log_id);
            (channel as BaseGuildTextChannel).send({ embeds: [embed] });

            fetch(`http://${config.server.server_url}:${config.server.server_port}/api/json`, {
                method: 'POST',
                body: JSON.stringify({
                    adminKey: config.bot.bot_password,
                    ip: "x",
                    key: key,
                    tor: 'DELETE_KEY'
                }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName("check")
            .setDescription("Check an licence key of a client")
            .addStringOption((option) =>
                option
                    .setName("key")
                    .setDescription("the key you want to check")
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName('admin_key')
                    .setDescription("The admin password to really create the request")
                    .setRequired(true)
            ),
        async run(client: Client, interaction: ChatInputCommandInteraction) {
            var key = interaction.options.getString('key');
            var adminKey = interaction.options.getString('admin_key');

            if (adminKey != config.bot.bot_password) {
                interaction.reply("the admin token is not good :c");
                return;
            };

            let sltcv = new EmbedBuilder()
                .setTitle("Pending check...")
                .setDescription(`<@${interaction.user.id}> want to check key: \n\`\`\`${key}\`\`\``)
                .setColor("#000000")
                .setFooter({ text: 'by Kisakay' });

            interaction.channel?.send({ embeds: [sltcv] });
            interaction.channel?.send(`**->**See Logs Here <#${config.channel_log_id}>`)

            let embed = new EmbedBuilder()
                .setTitle("Request to server...")
                .setColor("#000000")
                .setDescription(`A key is check by: <@${interaction.user.id}>\n\`\`\`${key}\`\`\``)
                .setFooter({ text: 'by Kisakay' })
                .setTimestamp();

            let channel = interaction.guild?.channels.cache.get(config.channel_log_id);
            (channel as BaseGuildTextChannel).send({ embeds: [embed] });

            fetch(`http://${config.server.server_url}:${config.server.server_port}/api/json`, {
                method: 'POST',
                body: JSON.stringify({
                    adminKey: config.bot.bot_password,
                    ip: "unknow",
                    key: key,
                    tor: 'CHECK_KEY'
                }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            }).then((json: any) => {

                if (json.descriptions == "Sorry but the key is not in our database !") {
                    interaction.reply(':x: **The key is not in the database !**');
                    return;
                };

                var ip = json.ip;
                var key = json.key;

                let embed = new EmbedBuilder()
                    .setTitle("Finnish!")
                    .setColor("#3b722e")
                    .setDescription(`A key is check by: <@${interaction.user.id}>\n\`\`\`${key}\`\`\`This IPV4 is **${ip}**`)
                    .setFooter({ text: "by Kisakay" })
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
                return;
            });
        }
    },
];

for (const cmd of commands) {
    if ('data' in cmd && 'run' in cmd) {
        client.commands.set(cmd.data.name, cmd);
    } else { logger.err(`[WARNING] The ${cmd}'s commands is missing a required "data" or "execute" property.`.red) }
}

(async () => {
    const rest = new REST().setToken(config.bot.bot_token);

    try {
        logger.log(`Started refreshing ${commands.length} application (/) commands.`.gray);

        const data = await rest.put(
            Routes.applicationCommands(config.bot.bot_id),
            {
                body: client.commands?.map((command) => ({
                    name: command.data.name,
                    description: command.data.description,
                    options: command.data.options,
                    type: ApplicationCommandType.ChatInput
                }))
            },
        );

        logger.log(`Successfully reloaded ${(data as unknown as ApplicationCommand<{}>[]).length} application (/) commands.`.green);
    } catch (error) {
        console.error(error);
    }
})();

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!config.permission.authorized.includes(interaction.user.id)
        || interaction.guild?.id !== config.guild_id
        || interaction.channelId !== config.channel_id) {

        interaction.reply({ content: `:x:` })
        return;
    }

    let cmd = client.commands.get(interaction.commandName);
    cmd.run(client, interaction)
});

client.login(config.bot.bot_token);
//made by Kisakay