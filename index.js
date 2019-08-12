require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')
const help = require('./src/utilities/help')
const hello = require('./src/others/hello')
const github = require('./src/utilities/gitHub')
const kick = require('./src/administration/kick')

const {SUCCESS, FAILURE, BOT_TOKEN} = process.env;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
})

client.on ('message', message => {
    switch (message.content.toLowerCase()) {
        case '##github':
            github(message)
            break;
        case '##hello':
            hello(message)
            break;
        case '##help':
            help(message)
            break;
        default:
            if (message.content.toLocaleLowerCase().startsWith('##kick'))
                kick(message)
    }
})

client.login(process.env.BOT_TOKEN);
