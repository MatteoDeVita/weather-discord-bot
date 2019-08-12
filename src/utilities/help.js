require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')

module.exports = function(message) {
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
