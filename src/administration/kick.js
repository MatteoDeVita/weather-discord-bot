require('dotenv').config();

module.exports = function(message) {
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