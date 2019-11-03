require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const help = require('./src/utilities/help')
const hello = require('./src/others/hello')
const github = require('./src/utilities/gitHub')
const kick = require('./src/administration/kick')
const weather = require('./src/utilities/weather')

const {SUCCESS, FAILURE, BOT_TOKEN} = process.env;

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
            if (message.content.toLocaleLowerCase().startsWith('##kick '))
                kick(message)
            else if (message.content.toLocaleLowerCase().startsWith('##weather'))
                weather(message)
                break;
            break;
    }
})

client.login(process.env.BOT_TOKEN);
