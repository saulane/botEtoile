const tmi = require('tmi.js');
const fs = require('fs');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const commandsFile = fs.readFileSync("commands.json");
const commandsList = JSON.parse(commandsFile);
const SetlistFirstLetter = new Set();
commandes = Object.keys(commandsList);
commandes.forEach(element => SetlistFirstLetter.add(element.charAt(0).toLowerCase()));


const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: 'botEtoile',
    password: process.env.OAUTH_TWITCH
  },
  channels: [process.env.CHANEL_NAME]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  msgFirstLetter = message.charAt(0).toLowerCase(); //Recuperation premiere lettre du message en lowercase
  if (!SetlistFirstLetter.has(msgFirstLetter)) return //Verification que la premiere lettre est dans la liste SetlistFirstLetter
  const args = message.split(' '); //Split message par " "
  const command = args.shift().toLowerCase(); //Enlever a args le 0 tableau et l'attribuer a la variable command en lowercase
  if (!commandsList.hasOwnProperty(command)) return //Verification que le premier mot est une commande
  
  const sender = tags.username;
  const toUser1 = args[0];
  const toUser2 = args[1];
  const commandeToApply = commandsList[command][0]

  if (commandeToApply.startsWith('eval')) {
    const to_eval = commandeToApply.substring(5);
    client.say(channel, eval(to_eval));
  } else if (commandeToApply.startsWith('urlfetch')){
    const url = eval(commandeToApply.substring(9));
    sayUrlFetchToChat(url, channel, client)
  } else {
    client.say(channel, commandeToApply);
  }
});


function sayUrlFetchToChat(url, channel, client){
  fetch(url)
    .then((res) => res.text())
    .then((txt) => {
      client.say(channel, txt)
    })
}
