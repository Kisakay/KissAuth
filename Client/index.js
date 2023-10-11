let port = ""
let url = ""
let serviceName = ""

//---------------------------------------------------------

const readline = require("readline");
const ipify = require('ipify');
const fs = require('fs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const superagent = require('superagent');
require('colors');

var lineReader = require('line-reader');
var detect = require('detect-file');

async function checki() {
  console.log('Checking if you are already activate the software...')
  let myip = await ipify({ useIPv6: false })
  var resti = detect("key.db");
  if (!resti) {
    return get()
  }
  lineReader.eachLine("key.db", function (first, last) {
    keyindb = first
    if (last) { }


    superagent
      .post(`http://${url}:${port}/api/json`)
      .send({
        adminKey: "unknow",
        ip: myip,
        key: keyindb,
        tor: 'LOGIN_KEY'
      })
      .end((err, response) => {
        var statussrv = response.body.title
        if (statussrv === 'Succeful') {
          console.log(`Yeah, ${serviceName} is activate !`.rainbow.bold)
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

checki()

async function get() {
  myip = await ipify({ useIPv6: false });

  rl.question(`Hey, ${serviceName} is not free ! Do you have key? If you here, i think is yes ! Type you key please :\n`.red + "key ~> ".blue, (answer) => {
    console.log('[API]'.green + ' >> Checking if your key is available'.yellow)
    let status = superagent
      .post(`http://${url}:${port}/api/json`)
      .send({
        adminKey: "unknow",
        ip: myip,
        key: answer,
        tor: 'LOGIN_KEY'
      })
      .end((err, response) => {
        var statussrv = response.body.title
        if (statussrv === 'Succeful') {
          console.log(`Yeah, you just activate ${serviceName}, gg !`.rainbow.bold)
          //writing in db
          fs.writeFile('key.db', `${answer}\nby Kisakay with <3`, function (err) {
            if (err) throw err;
            //the software :
            start();
          });
        }
        if (statussrv === "Your key is not unvailable !") {
          console.log("No, this key is not correct ! Please contact support, if you don't have key !".red.bold)
        } else {
          if (statussrv === "Bad ip with your key !") {
            console.log("Your key is not associed to this ip ! Please disable your vpn or switch to classical connections ! \nFor more informations please contact the support !\nIf you don't know, 1* Key is for 1* People !".red.bold)
          }

        }
      })
  })
}

function start() {
  //Your Software Here :
}
//made by Kisakay
//inspirate is not skid
//anti-skid
