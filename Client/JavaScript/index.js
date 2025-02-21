const serviceConfig = {
    port: 3030,
    url: "127.0.0.1",
    serviceName: "Example software name"
};

//---------------------------------------------------------
const readline = require('node:readline');
const process = require('node:process');
const fs = require('node:fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function licenceChecker() {

    console.log('Checking if you are already activate the software...');

    if (!fs.existsSync("key.db")) {
        return get()
    } else {
        fs.readFile('key.db', 'utf8', (err, data) => {
            if (data) {
                let lines = data.split("\n");

                fetch(`http://${serviceConfig.url}:${serviceConfig.port}/license/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        key: lines[0]
                    }),
                    headers: { 'Content-type': 'application/json; charset=UTF-8' },
                })
                    .then(async (res) => {
                        var states = await res.json();

                        if (states.success) {
                            console.log(`Yeah, ${serviceConfig.serviceName} is activate !`)
                            console.log("-----> Starting The Software...")
                            //starting ...
                            start()
                        } else {
                            if (states.error === "Bad ip with your key !") {
                                start()
                            } else {
                                get()
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            };
        });
    }
}

licenceChecker()

async function get() {
    rl.question(`Hey, ${serviceConfig.serviceName} is not free ! Do you have key? If you here, i think is yes ! Type you key please :\n` + "key ~> ", (answer) => {
        console.log('[API]' + ' >> Checking if your key is available');

        fetch(`http://${serviceConfig.url}:${serviceConfig.port}/license/login`, {
            method: 'POST',
            body: JSON.stringify({
                key: answer,
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then(async (res) => {
                var states = await res.json();

                if (states.success) {
                    console.log(`Yeah, you just activate ${serviceConfig.serviceName}, gg !`)
                    //writing in db
                    fs.writeFile('key.db', `${answer}\nby Kisakay with <3`, function (err) {
                        if (err) throw err;
                        //the software :
                        start();
                    });
                    return;
                }
                if (states.error === "Key doesn't exist") {
                    console.log("No, this key is not correct ! Please contact support, if you don't have key !");
                    process.exit(1);
                } else if (states.error === "Bad ip with your key !") {
                    console.log("Your key is not associed to this ip ! Please disable your vpn or switch to classical connections !\nFor more informations please contact the support !\nIf you don't know, 1* Key is for 1* People !")
                    process.exit(1);
                }
            })
            .catch(error => {
                console.log(error)
            })
    })
}

function start() {
    //Your Software Here :
}
//made by Kisakay