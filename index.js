require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const {SUCCESS, FAILURE, BOT_TOKEN} = process.env;

var getConfirmation = () => {
	client.on('message', answer => answer.content === 'YES');
}

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
        msg.reply('https://github.com/Mattness8');
})

client.on('message', message => {
	if (message.content.toLowerCase().startsWith('##kick')) {
		const mentioned_user = message.mentions.members.first();
		if (!mentioned_user) {
			message.reply('You have to mention a user you dummy');
			return FAILURE;
		}
		if (!mentioned_user.kickable) {
			message.reply(`I don't have the permissions to kick this user`);
			return FAILURE;
		}
		message.reply(`Do you really want to kick ${mentioned_user.user.tag} ? (Answer with "YES" or "NO")`);
		const collector = message.channel.createCollector(
			answer => answer.author.id === message.author.id,
			{max : 5, time : 60000}
		)
		collector.on('collect', collector_answer => {
			if (collector_answer.content === 'YES') {
				mentioned_user.kick()
				.then(() => message.reply(`${mentioned_user.user.tag} has been kicked. ciao !`))
				.catch(error => message.reply(`I couldn't kick this user, sorry. (error code : ${error})`))
				collector.stop()
				return SUCCESS;
			}
			else if (collector_answer.content === 'NO') {
				message.reply('OK, mission aborted !');
				collector.stop('No kick');
				return FAILURE;
			}
			else {
				message.reply('This is not a good answer, please answer with "YES" or "NO"');
			}
		})
		return FAILURE;
	}
})

client.login(BOT_TOKEN);