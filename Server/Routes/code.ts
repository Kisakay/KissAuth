/*
type of requests - CREATE/REMOVE/LOGIN/CHECK
key 
adminPassword
ipv4
    ____                       ___         __  __               __  _ _____            __                
   / __ \___  ____ _________  /   | __  __/ /_/ /_  ___  ____  / /_(_) __(_)________ _/ /_____  _____    
  / /_/ / _ \/ __ `/ ___/ _ \/ /| |/ / / / __/ __ \/ _ \/ __ \/ __/ / /_/ / ___/ __ `/ __/ __ \/ ___/    
 / ____/  __/ /_/ / /__/  __/ ___ / /_/ / /_/ / / /  __/ / / / /_/ / __/ / /__/ /_/ / /_/ /_/ / /        
/_/    \___/\__,_/\___/\___/_/  |_\__,_/\__/_/ /_/\___/_/ /_/\__/_/_/ /_/\___/\__,_/\__/\____/_/                                                    
---------------------------------------------------------*/
import { Base, BaseGuild, BaseGuildTextChannel, Client, EmbedBuilder } from "discord.js";
import { Request, Response } from "express";

import { QuickDB } from 'quick.db';
import { config } from '../config';

const db = new QuickDB();
interface Code {
    good: {
        title: string
        descriptions: string
    },
    good2: {
        title: string
        descriptions: string,
        main?: {
            ip: any,
            key: any
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
    const { ip, key, tor, adminKey } = req.body;

    if (!ip || !key) return console.log("-> Bad json request without ip/key");

    console.log(tor)
    if (tor !== 'CREATE_KEY' && tor !== 'DELETE_KEY' && tor !== 'CHECK_KEY' && tor !== 'LOGIN_KEY') {
        console.log('-> Bad json requests without options');
        return res.send('-> Bad json requests without options');
    }

    console.log(`--------------------------------------------------------------------------------------------------------------------\nIP: ${ip}\nREQUEST TYPE: ${tor}\nADMINKEY: ${adminKey}\nKEY: ${key}\n--------------------------------------------------------------------------------------------------------------------`)

    if (tor == "CREATE_KEY") {
        console.log(adminKey, config.adminKey)
        if (adminKey != config.adminKey) return console.log("-> Bad json requests without the good admin key")
        await db.set(`key_${key}`, ip);
        res.send("Succefully create a key !")

        const embed = new EmbedBuilder()
            .setTitle("Server ~:")
            .setColor("#008000")
            .setDescription(`A key has created\`\`\`${key}\`\`\`This IPV4 is **${ip}**`)
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.sendID) as BaseGuildTextChannel).send({ embeds: [embed] });
        return
    }

    if (tor == "DELETE_KEY") {
        if (adminKey != config.adminKey) return console.log("-> Bad json requests without the good admin key")
        let value = await db.get(`key_${key}.${ip}`);
        if (!value) return;
        res.send("Succefully delete a key !")

        const embed = new EmbedBuilder()
            .setTitle("Server ~:")
            .setColor("#008000")
            .setDescription(`A key has deleted\`\`\`${key}\`\`\`This IPV4 is **${value}**`)
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.sendID) as BaseGuildTextChannel).send({ embeds: [embed] });
        await db.delete(`key_${key}.${ip}`);
        return
    }

    if (tor == "LOGIN_KEY") {
        const { ip, key, tor, adminKey } = req.body
        if (!ip || !key) return console.log("-> Bad json request without ip/key")
        if (tor != 'LOGIN_KEY') return
        if (adminKey != 'unknow') return
        let value = await db.get(`key_${key}`);
        if (!value) { return res.json(data.bad2) };
        if (value != ip) return res.json(data.bad);

        const embed = new EmbedBuilder()
            .setTitle("Server ~:")
            .setColor("#008000")
            .setDescription(`A key has use for login\`\`\`${key}\`\`\`This IPV4 is **${value}**`)
            .setFooter({ text: "by Kisakay" })
            .setTimestamp();

        (client.channels.cache.get(config.sendID) as BaseGuildTextChannel).send({ embeds: [embed] });
        res.json(data.good);
        return;
    }

    if (tor == "CHECK_KEY") {
        const { ip, key, tor, adminKey } = req.body
        if (!ip || !key) return console.log("-> Bad json request without ip/key")
        if (adminKey != config.adminKey) return
        let value = await db.get(`key_${key}`);
        if (!value) { return res.json(data.bad2); }
        let fetchIPV4 = { ip: value, key: key }


        data.good2.main = fetchIPV4;
        res.json(data.good2)
        return;
    }
}
//made by Kisakay
//inspirate is not skid
//anti-skid