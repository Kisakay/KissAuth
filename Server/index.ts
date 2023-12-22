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
} from "discord.js";

import superagent, { Response } from 'superagent';
import rateLimit from "express-rate-limit";
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
var rand = require("generate-key");

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

app.listen(config['port'], () => {
    console.log(`Listening on port ${config['port']}`);
});

client.commands = new Collection();

client.on('ready', () => {
    console.log(`Logged as ${client.user?.tag}`)
});

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

            if (adminKey != config.key4bot) {
                interaction.reply("the admin token is not good :c");
                return;
            };

            var keyy = rand.generateKey(400);

            let sltcv = new EmbedBuilder()
                .setTitle("Key in creation")
                .setDescription(`<@${interaction.user.id}> create: \n\`\`\`${keyy}\`\`\``)
                .setColor("#000000")
                .setFooter({ text: 'by Kisakay' });

            interaction.reply({ embeds: [sltcv] });
            interaction.channel?.send(`**->** <#${config.sendID}>`);

            let embed = new EmbedBuilder()
                .setTitle("Request to server...")
                .setColor("#000000")
                .setDescription(`A new key is for waiting by <@${interaction.user.id}>\n\`\`\`${keyy}\`\`\`IPV4: **${ip}**`)
                .setFooter({ text: "by Kisakay" })
                .setTimestamp();

            let channel = interaction.guild?.channels.cache.get(config.sendID);

            (channel as BaseGuildTextChannel).send({ embeds: [embed] });

            superagent
                .post(`http://${config.url}:${config['port']}/api/json`)
                .send({
                    adminKey: config.adminKey,
                    ip: ip,
                    key: keyy,
                    tor: 'CREATE_KEY'
                })
                .set('accept', 'json')
                .end(() => { });
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

            if (adminKey != config.key4bot) {
                interaction.channel?.send("the admin token is not good :c");
                return;
            };

            const sltcv = new EmbedBuilder()
                .setTitle("Pending deletion...")
                .setDescription(`<@${interaction.user.id}> want to delete: \n\`\`\`${key}\`\`\``)
                .setColor("#000000")
                .setFooter({ text: 'by Kisakay' });

            interaction.reply({ embeds: [sltcv] });
            interaction.channel?.send(`**->** <#${config.sendID}>`);

            const embed = new EmbedBuilder()
                .setTitle("Request to server...")
                .setColor("#000000")
                .setDescription(`A key is pending deletion by: <@${interaction.user.id}>\n\`\`\`${key}\`\`\``)
                .setFooter({ text: "by Kisakay" })
                .setTimestamp();

            let channel = interaction.guild?.channels.cache.get(config.sendID);
            (channel as BaseGuildTextChannel).send({ embeds: [embed] });

            superagent
                .post(`http://${config.url}:${config['port']}/api/json`)
                .send({
                    adminKey: config.adminKey,
                    ip: "x",
                    key: key,
                    tor: 'DELETE_KEY'
                })
                .set('accept', 'json')
                .end(() => { })
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

            if (adminKey != config.key4bot) {
                interaction.reply("the admin token is not good :c");
                return;
            };

            let sltcv = new EmbedBuilder()
                .setTitle("Pending check...")
                .setDescription(`<@${interaction.user.id}> want to check key: \n\`\`\`${key}\`\`\``)
                .setColor("#000000")
                .setFooter({ text: 'by Kisakay' });

            interaction.channel?.send({ embeds: [sltcv] });
            interaction.channel?.send(`**->**See Logs Here <#${config.sendID}>`)

            let embed = new EmbedBuilder()
                .setTitle("Request to server...")
                .setColor("#000000")
                .setDescription(`A key is check by: <@${interaction.user.id}>\n\`\`\`${key}\`\`\``)
                .setFooter({ text: 'by Kisakay' })
                .setTimestamp();

            let channel = interaction.guild?.channels.cache.get(config.sendID);
            (channel as BaseGuildTextChannel).send({ embeds: [embed] });

            superagent
                .post(`http://${config.url}:${config['port']}/api/json`)
                .send({
                    adminKey: config.adminKey,
                    ip: "unknow",
                    key: key,
                    tor: 'CHECK_KEY'
                })
                .set('accept', 'json')
                .end((error: string, res: Response) => {
                    console.log(error)
                    if (res.body.descriptions == "Sorry but the key is not in our database !") {
                        interaction.reply(':x: **The key is not in the database !**');
                        return;
                    };

                    var ip = res.body.ip;
                    var key = res.body.key;

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
    } else { console.log(`[WARNING] The ${cmd}'s commands is missing a required "data" or "execute" property.`) }
}

const rest = new REST().setToken(config.token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(config.botId),
            {
                body: client.commands?.map((command) => ({
                    name: command.data.name,
                    description: command.data.description,
                    options: command.data.options,
                    type: ApplicationCommandType.ChatInput
                }))
            },
        );

        console.log(`Successfully reloaded ${(data as unknown as ApplicationCommand<{}>[]).length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.user.id !== config.author1
        || interaction.guild?.id !== config.guildID
        || interaction.channelId !== config.channelID) {
        return;
    }

    let cmd = client.commands.get(interaction.commandName);
    cmd.run(client, interaction)
});

client.login(config.token);
//made by Kisakay