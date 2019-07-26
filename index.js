require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const {SUCCESS, FAILURE, BOT_TOKEN} = process.env;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
})

client.on('message', msg => {
	if (msg.content.toLowerCase() === 'hello') {
    	msg.reply('hello world!');
  	}
})

client.on('message', msg => {
    if (msg.content.toLowerCase() === 'github')
        msg.reply('https://github.com/Mattness8')
})

client.on('message', message => {
	if (message.content.toLowerCase().startsWith('##kick')) {
		const mentioned_user = message.mentions.members.first();
		if (!mentioned_user) {
			message.reply('You have to mention a user you dummy');
			return FAILURE;
		}
		if (!mentioned_user.kickable) {
			message.reply(`I don't have the permissions to use this user`);
			return FAILURE;
		}
		mentioned_user.kick()
		.then(() => message.reply(`${mentioned_user.user.tag} has been kicked. ciao !`))
    	.catch(error => message.reply(`I couldn't kick this user, sorry. (error code : ${error})`))
	}
})

client.login(BOT_TOKEN);