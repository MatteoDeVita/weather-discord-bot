require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  if (msg.content === 'hello') {
    msg.reply('hello world!')
  }
})

client.on('message', msg => {
    if (msg.content === 'github')
        msg.reply('https://github.com/Mattness8')
})

client.login(process.env.BOT_TOKEN)