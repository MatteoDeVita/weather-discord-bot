require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')

const {SUCCESS, FAILURE, BOT_TOKEN} = process.env;

var getConfirmation = () => {
	client.on('message', answer => answer.content === 'YES');
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
})

client.on('message', msg => {
	if (msg.content.toLowerCase() === '##hello') {
    	msg.reply('hello world!');
  	}
})

client.on('message', msg => {
    if (msg.content.toLowerCase() === '##github')
        msg.reply('https://github.com/Mattness8');
})

client.on('message', message => {
	if (message.content.toLowerCase().startsWith('##kick')) {
		const mentioned_user = message.mentions.members.first();
		if (!mentioned_user) {
			message.reply('You have to mention a user you dummy');
			return process.env.FAILURE;
		}
		if (!mentioned_user.kickable) {
			message.reply(`I don't have the permissions to kick this user`);
			return process.env.FAILURE;
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
				return process.env.SUCCESS;
			}
			else if (collector_answer.content === 'NO') {
				message.reply('OK, mission aborted !');
				collector.stop('No kick');
				return process.env.FAILURE;
			}
			else {
				message.reply('This is not a good answer, please answer with "YES" or "NO"');
			}
		})
		return process.env.FAILURE;
	}

	if (message.content.toLocaleLowerCase() === '##help') {
		fs.readFile('./ressources/commands.JSON', (err, data) => {
			const commands = JSON.parse(data.toString())
			let embedMessage = new Discord.RichEmbed()
				.setColor('#77318c')
				.setTitle('The available commands are : ')
				.setThumbnail('https://cdn.discordapp.com/avatars/603902050933276673/0ea81578034da02f24faf41172a7ae1a.png?size=2048')
			const categories = Object.keys(commands);
			for (let currentCategorie of categories) {
				const currentCommands = Object.keys(commands[currentCategorie])
				let commandsStr = ''
				for (let currentCommand of currentCommands) {
					commandsStr +=`\`${currentCommand}\` : ${commands[currentCategorie][currentCommand]}\n`
				}
				embedMessage.addField(currentCategorie, commandsStr)
			}
			message.channel.send(embedMessage)
		})

	}
})

client.login(process.env.BOT_TOKEN);