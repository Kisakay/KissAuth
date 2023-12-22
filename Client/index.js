const serviceConfig = {
    port: 3030,
    url: "127.0.0.1",
    serviceName: "Example software name"
};

//---------------------------------------------------------
import superagent from 'superagent';
import readline from 'readline';
import ipify from 'ipify';
import fs from 'node:fs'

import 'colors';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

import lineReader from 'line-reader';
import detect from 'detect-file';

async function licenceChecker() {
    console.log('Checking if you are already activate the software...')
    let myip = await ipify({ useIPv6: false })
    var resti = detect("key.db");
    if (!resti) {
        return get()
    }
    lineReader.eachLine("key.db", function (first, last) {
        keyindb = first

        superagent
            .post(`http://${serviceConfig.url}:${serviceConfig.port}/api/json`)
            .send({
                adminKey: "unknow",
                ip: myip,
                key: keyindb,
                tor: 'LOGIN_KEY'
            })
            .end((err, response) => {
                var statussrv = response.body.title
                if (statussrv === 'Succeful') {
                    console.log(`Yeah, ${serviceConfig.serviceName} is activate !`.rainbow.bold)
                    console.log("-----> Starting The Software...".green.bold)
                    //starting ...
                    start()
                } else {
                    if (statussrv === "Bad ip with your key !") {
                        start()
                    } else {
                        get()
                    }
                }
            })
    })
}

licenceChecker()

async function get() {
    const myip = await ipify({ useIPv6: false });

    rl.question(`Hey, ${serviceConfig.serviceName} is not free ! Do you have key? If you here, i think is yes ! Type you key please :\n`.red + "key ~> ".blue, (answer) => {
        console.log('[API]'.green + ' >> Checking if your key is available'.yellow)
        superagent
            .post(`http://${serviceConfig.url}:${serviceConfig.port}/api/json`)
            .send({
                adminKey: "unknow",
                ip: myip,
                key: answer,
                tor: 'LOGIN_KEY'
            })
            .end((err, response) => {
                var statussrv = response.body.title
                if (statussrv === 'Succeful') {
                    console.log(`Yeah, you just activate ${serviceConfig.serviceName}, gg !`.rainbow.bold)
                    //writing in db
                    fs.writeFile('key.db', `${answer}\nby Kisakay with <3`, function (err) {
                        if (err) throw err;
                        //the software :
                        start();
                    });
                }
                if (statussrv === "Your key is not unvailable !") {
                    console.log("No, this key is not correct ! Please contact support, if you don't have key !".red.bold)
                } else if (statussrv === "Bad ip with your key !") {
                    console.log("Your key is not associed to this ip ! Please disable your vpn or switch to classical connections !\nFor more informations please contact the support !\nIf you don't know, 1* Key is for 1* People !".red.bold)
                }
            })
    })
}

function start() {
    //Your Software Here :
}
//made by Kisakay