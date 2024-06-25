/*
 *     ____                       ___         __  __               __  _ _____            __                
 *    / __ \___  ____ _________  /   | __  __/ /_/ /_  ___  ____  / /_(_) __(_)________ _/ /_____  _____    
 *   / /_/ / _ \/ __ `/ ___/ _ \/ /| |/ / / / __/ __ \/ _ \/ __ \/ __/ / /_/ / ___/ __ `/ __/ __ \/ ___/    
 *  / ____/  __/ /_/ / /__/  __/ ___ / /_/ / /_/ / / /  __/ / / / /_/ / __/ / /__/ /_/ / /_/ /_/ / /        
 * /_/    \___/\__,_/\___/\___/_/  |_\__,_/\__/_/ /_/\___/_/ /_/\__/_/_/ /_/\___/\__,_/\__/\____/_/                                                    
*/

import { BaseGuildTextChannel, Client, EmbedBuilder } from "pwss";
import { Request, Response } from "express";

import { JSONDriver, QuickDB } from 'quick.db';
import { config } from '../config';

const db = new QuickDB({ driver: new JSONDriver() });

interface Code {
    good: {
        title: string
        descriptions: string
    },
    good2: {
        title: string
        descriptions: string,
        main?: {
            ip: string,
            key: string
        }
    },
    bad: {
        title: string
        descriptions: string
    },
    bad2: {
        title: string
        descriptions: string
    },
};

const data: Code = {
    "good": {
        "title": "Succeful",
        "descriptions": "yes you dit it !"
    },
    "good2": {
        "title": "Available",
        "descriptions": "the key is successful available"
    },
    "bad": {
        "title": "Bad ip with your key !",
        "descriptions": "Sorry but the ipv4 in our database is not the same as you :/"
    },
    "bad2": {
        "title": "Your key is not unvailable !",
        "descriptions": "Sorry but the key is not in our database !"
    }
}
//---------------------------------------------------------

export = async (req: Request, res: Response, client: Client) => {
    var key: string = req.body.key;
    key = key.split(' ')[0].split('\n')[0]

    let adminKey: string = req.body.adminKey;
    let tor: string = req.body.tor;
    let ip: string = req.body.ip;

    if (!ip || !key) {
        console.log("(1) -> Bad json request without ip/key");
        return;
    };

    if (tor !== 'CREATE_KEY' && tor !== 'DELETE_KEY' && tor !== 'CHECK_KEY' && tor !== 'LOGIN_KEY') {
        console.log('(2) -> Bad json requests without options');
        res.send('-> Bad json requests without options');
        return;
    }

    console.log(`--------------------------------------------------------------------------------------------------------------------\nIP: ${ip}\nREQUEST TYPE: ${tor}\nADMINKEY: ${adminKey}\nKEY: ${key}\n--------------------------------------------------------------------------------------------------------------------`)

    if (tor == "CREATE_KEY" && adminKey == config.bot.bot_password) {
        await db.set(`key_${key}`, ip);
        res.send("Succefully create a key !");

        let embed = new EmbedBuilder()
            .setTitle("Server ~:")
            .setColor("#008000")
            .setDescription(`A key has created\`\`\`${key}\`\`\`This IPV4 is **${ip}**`)
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.channel_log_id) as BaseGuildTextChannel).send({ embeds: [embed] });
        return;
    };

    if (tor == "DELETE_KEY" && adminKey == config.bot.bot_password) {

        let value = await db.get(`key_${key}.${ip}`);
        if (!value) return;
        res.send("Succefully delete a key !");

        let embed = new EmbedBuilder()
            .setTitle("Server ~:")
            .setColor("#008000")
            .setDescription(`A key has deleted\`\`\`${key}\`\`\`This IPV4 is **${value}**`)
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.channel_log_id) as BaseGuildTextChannel).send({ embeds: [embed] });
        await db.delete(`key_${key}.${ip}`);
        return;
    };

    if (tor == "LOGIN_KEY" && adminKey == 'unknow') {

        let value = await db.get(`key_${key}`);

        if (!value) {
            res.json(data.bad2);
            return;
        } else if (value != ip) {
            res.json(data.bad);
            return;
        };

        let embed = new EmbedBuilder()
            .setTitle("Server ~:")
            .setColor("#008000")
            .setDescription(`A key has use for login\`\`\`${key}\`\`\`This IPV4 is **${value}**`)
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.channel_log_id) as BaseGuildTextChannel).send({ embeds: [embed] });
        res.send(data.good);
        return;
    };

    if (tor == "CHECK_KEY" && adminKey != config.bot.bot_password) {
        let value = await db.get(`key_${key}`);
        let fetchIPV4 = { ip: value, key: key }

        if (!value) {
            return res.json(data.bad2);
        };

        data.good2.main = fetchIPV4;
        res.json(data.good2)
        return;
    };
};
//made by Kisakay