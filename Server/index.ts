import { Client, EmbedBuilder, Partials, GatewayIntentBits, Message } from "discord.js";
import config from "./config";
import superagent from 'superagent';
import express from 'express';
import rateLimit from "express-rate-limit";

import code from './Routes/code';

let client = new Client({
  intents: [
    // GatewayIntentBits.Guilds,
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMessageReactions,
    // GatewayIntentBits.GuildMembers,
    // GatewayIntentBits.GuildMessageReactions,
    // GatewayIntentBits.GuildMessageTyping,
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.Guilds,
  ], partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
  ]
});

//---------------------------------------------------------
var app = express();
var rand = require("generate-key");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true
});

app.use(limiter);
app.use(express.json({ limit: "500mb" }));

app.post('/api/json', code);

app.listen(config['port'], () => {
  console.log(`Listening on port 2010`);
});

client.on('message', (message: Message) => {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

  if (message.author.id !== config.author1
    || message.guild?.id !== config.guildID
    || message.channel.id !== config.channelID) {
    return;
  }

  if (message.content.startsWith(config.prefix + 'create')) {
    var ip = args[1];
    var adminKey = args[2];

    if (!ip) {
      message.channel.send('error: ip dont send');
      return;
    }

    if (!adminKey) {
      message.channel.send('error: admin key dont send');
      return;
    }

    if (adminKey != config.key4bot) {
      message.channel.send("the admin token is not good :c");
      return;
    }

    var keyy = rand.generateKey(400);

    let sltcv = new EmbedBuilder()
      .setTitle("Key in creation")
      .setDescription(`<@${message.author.id}> create: \n\`\`\`${keyy}\`\`\``)
      .setColor("#000000")
      .setFooter({ text: 'by Kisakay' });

    message.channel.send({ embeds: [sltcv] });
    message.channel.send(`**->** <#${config.sendID}>`);

    let embed = new EmbedBuilder()
      .setTitle("Request to server...")
      .setColor("#000000")
      .setDescription(`A new key is for waiting by <@${message.author.id}>\n\`\`\`${keyy}\`\`\`IPV4: **${ip}**`)
      .setFooter({ text: "by Kisakay" })
      .setTimestamp();

    let channel: any = message.guild.channels.cache.get(config.sendID)
    channel.send({ embeds: [embed] });

    superagent
      .post(`http://${config.url}:${config['port']}/api/json`)
      .send({
        adminKey: config.adminKey,
        ip: ip,
        key: keyy,
        tor: 'CREATE_KEY'
      })
      .set('accept', 'json')
      .end((err: any, response: any) => { });
    return;

  } else if (message.content.startsWith(config.prefix + 'delete')) {

    var key = args[1];
    var adminKey = args[2];

    if (!key) {
      message.channel.send('error: key dont send')
      return;
    };

    if (!adminKey) {
      message.channel.send('error: admin key dont send')
      return;
    };

    if (adminKey != config.key4bot) {
      message.channel.send("the admin token is not good :c");
      return;
    };

    const sltcv = new EmbedBuilder()
      .setTitle("Pending deletion...")
      .setDescription(`<@${message.author.id}> want to delete: \n\`\`\`${key}\`\`\``)
      .setColor("#000000")
      .setFooter({ text: 'by Kisakay' });

    message.channel.send({ embeds: [sltcv] });
    message.channel.send(`**->** <#${config.sendID}>`);

    const embed = new EmbedBuilder()
      .setTitle("Request to server...")
      .setColor("#000000")
      .setDescription(`A key is pending deletion by: <@${message.author.id}>\n\`\`\`${key}\`\`\``)
      .setFooter({ text: "by Kisakay" })
      .setTimestamp();

    let channel: any = message.guild.channels.cache.get(config.sendID)
    channel.send({ embeds: [embed] });

    superagent
      .post(`http://${config.url}:${config['port']}/api/json`)
      .send({
        adminKey: config.adminKey,
        ip: "x",
        key: key,
        tor: 'DELETE_KEY'
      })
      .set('accept', 'json')
      .end((err: any, response: any) => { })

  } else if (message.content.startsWith(config.prefix + 'check')) {

    var key = args[1];
    var adminKey = args[2];

    if (!key) {
      message.channel.send('error: key dont send');
      return;
    };

    if (!adminKey) {
      message.channel.send('error: admin key dont send');
      return;
    };

    if (adminKey != config.key4bot) {
      message.channel.send("the admin token is not good :c");
      return;
    };

    let sltcv = new EmbedBuilder()
      .setTitle("Pending check...")
      .setDescription(`<@${message.author.id}> want to check key: \n\`\`\`${key}\`\`\``)
      .setColor("#000000")
      .setFooter({ text: 'by Kisakay' });

    message.channel.send({ embeds: [sltcv] });
    message.channel.send(`**->**See Logs Here <#${config.sendID}>`)

    let embed = new EmbedBuilder()
      .setTitle("Request to server...")
      .setColor("#000000")
      .setDescription(`A key is check by: <@${message.author.id}>\n\`\`\`${key}\`\`\``)
      .setFooter({ text: 'by Kisakay' })
      .setTimestamp();

    let channel: any = message.guild.channels.cache.get(config.sendID)
    channel.send({ embeds: [embed] });

    superagent
      .post(`http://${config.url}:${config['port']}/api/json`)
      .send({
        adminKey: config.adminKey,
        ip: "unknow",
        key: key,
        tor: 'CHECK_KEY'
      })
      .set('accept', 'json')
      .end((error: any, res: { body: { descriptions: string; main: { ip: any; key: any; }; }; }) => {

        if (res.body.descriptions == "Sorry but the key is not in our database !") {
          message.channel.send(':x: **The key is not in the database !**');
          return;
        };

        var ip = res.body.main.ip;
        var key = res.body.main.key;

        let embed = new EmbedBuilder()
          .setTitle("Finnish!")
          .setColor("#3b722e")
          .setDescription(`A key is check by: <@${message.author.id}>\n\`\`\`${key}\`\`\`This IPV4 is **${ip}**`)
          .setFooter({ text: "by Kisakay" })
          .setTimestamp();

        message.channel.send({ embeds: [embed] });
        return;
      });
  }
});

client.login(config.token);
//made by Kisakay
//inspirate is not skid
//anti-skid