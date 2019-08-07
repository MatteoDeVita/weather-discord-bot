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

	if (message.content.toLocaleLowerCase() === '##help') { //need also fs
		fs.readFile('./ressources/commands.JSON', (err, data) => {
			const commands = JSON.parse(data.toString())
			message.reply(` the commands are :\n${commands}`)
			const categories = Object.keys(commands);
			for (let currentCategorie of categories) {
				message.channel.send(`${currentCategorie}`)
				console.log(currentCategorie)
				const currentCommands = Object.keys(commands[currentCategorie])
				for (let currentCommand of currentCommands) {
					console.log(`	${currentCommand}: ${commands[currentCategorie][currentCommand]}`)
					message.channel.send(`\t\`${currentCommand}\`: ${commands[currentCategorie][currentCommand]}`)
				}
					//console.log(currentCommand)
					//console.log(commands[currentCategorie][currentCommand])
			}
			// console.log(`categories = ${categories}`);
			// console.log(`${JSON.stringify(commands.administration)}`)
			// for (let i in commands) {			
			// 		message.reply(`${JSON.stringify(i)}`)				
			// 	//console.log(commands[i])
			// 	//message.reply(`${i}`)
			// }
			// message.channel.send({embed: {
			// 	color: 3447003,
			// 	author: {
			// 	  name: client.user.username,
			// 	  icon_url: client.user.avatarURL
			// 	},
			// 	title: "This is an embed",
			// 	url: "http://google.com",
			// 	description: "This is a test embed\nto showcase what they look like and what they can do.",
			// 	fields: [{
			// 		name: "Fields",
			// 		value: "They can have different fields with small headlines."
			// 	  },
			// 	  {
			// 		name: "Masked links",
			// 		value: "You can put [masked links](http://google.com) inside of rich embeds."
			// 	  },
			// 	  {
			// 		name: "Markdown",
			// 		value: "You can put all the *usual* **__Markdown__** inside of them."
			// 	  }
			// 	],
			// 	timestamp: new Date(),
			// 	footer: {
			// 	  icon_url: client.user.avatarURL,
			// 	  text: "© Example"
			// 	}
			//   }
			// });
		})
	}
})


client.login(process.env.BOT_TOKEN);