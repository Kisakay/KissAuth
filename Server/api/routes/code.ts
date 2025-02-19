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

import { BaseGuildTextChannel, Client, EmbedBuilder } from "discord.js";
import { Request, Response } from "express";

import { config } from '../../config.js';
import { logger } from "ihorizon-tools";
import { Database } from "../../shared/database.js";

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

export const server = async (req: Request, res: Response, client: Client) => {
    var key: string = req.body.key;
    key = key.split(' ')[0].split('\n')[0]

    let adminKey: string = req.body.adminKey;
    let tor: string = req.body.tor;
    let ip: string = req.body.ip;

    if (!ip || !key) {
        logger.err("(1) -> Bad json request without ip/key");
        return;
    };

    if (tor !== 'CREATE_KEY' && tor !== 'DELETE_KEY' && tor !== 'CHECK_KEY' && tor !== 'LOGIN_KEY') {
        logger.err('(2) -> Bad json requests without options'.red);
        res.send('-> Bad json requests without options');
        return;
    }

    logger.legacy(`--------------------------------------------------------------------------------------------------------------------\nIP: ${ip}\nREQUEST TYPE: ${tor}\nADMINKEY: ${adminKey}\nKEY: ${key}\n--------------------------------------------------------------------------------------------------------------------`)

    if (tor == "CREATE_KEY" && adminKey === config.server.server_authorizations) {
        await Database.set(`key.${key}`, ip);
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

    if (tor == "DELETE_KEY" && adminKey === config.server.server_authorizations) {
        let value = await Database.get(`key.${key}`);
        if (!value) return;
        res.send("Succefully delete a key !");

        let embed = new EmbedBuilder()
            .setTitle("Server ~:")
            .setColor("#008000")
            .setDescription(`A key has deleted\`\`\`${key}\`\`\`This IPV4 is **${value}**`)
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.channel_log_id) as BaseGuildTextChannel).send({ embeds: [embed] });
        await Database.delete(`key.${key}`);
        return;
    };

    if (tor == "LOGIN_KEY" && adminKey === 'unknow') {

        let value = await Database.get(`key.${key}`);

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

    if (tor == "CHECK_KEY" && adminKey === config.server.server_authorizations) {
        let value = await Database.get(`key.${key}`);
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