const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const windDirections = require('../../ressources/windDirections.js')
const { FAILURE } = process.env

const getMeteorologicalDegreeDirection = (degree) => {
    for (const windDirection of windDirections) {
        if (degree >= windDirection.min && degree < windDirection.max)
            return windDirection.value
    }
    return null
}

module.exports = function(message) {
    const opt = message.content.split(' ')
    const { OPEN_WEATHER_API_KEY } = process.env
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${opt[1]}&appid=${OPEN_WEATHER_API_KEY}&units=metric`) //TODO add units to parameters
    .then(response => response.json())
    .then(parsedWeather => {
        const weatherEmbeddedMessage = new Discord.RichEmbed()
        .setTitle(`Weather in ${parsedWeather.name}`)
        .setURL(`https://openweathermap.org/find?q=${opt[1]}`)
        .setAuthor(
                'Mattness_bot',
                'https://cdn.discordapp.com/avatars/603902050933276673/0ea81578034da02f24faf41172a7ae1a.png?size=2048',
                'https://github.com/Mattness8/Mattness_discord_bot'
            )
        .setColor('#eb6e4b')
        .setThumbnail('https://openweathermap.org/themes/openweathermap/assets/img/openweather-negative-logo-RGB.png')
        .setDescription(`
            Temperature : ${parsedWeather.main.temp}°C\n
            Minimum: ${parsedWeather.main.temp_min}°C\n
            Maximum: ${parsedWeather.main.temp_max}°C\n
            Humidity: ${parsedWeather.main.humidity}%\n
            Wind: ${parsedWeather.wind.speed} meter/sec, ${(parsedWeather.wind.speed * 3.6).toFixed(2)} km/h ${parsedWeather.wind.deg}\
            degrees (${getMeteorologicalDegreeDirection(parsedWeather.wind.deg)})\n
            Cloudiness : ${parsedWeather.clouds.all}%\n
        `)
        parsedWeather.weather.forEach(weather => {
            weatherEmbeddedMessage.addField(weather.main, weather.description)
            .setImage(`http://openweathermap.org/img/wn/${weather.icon}@2x.png`)
        })
        weatherEmbeddedMessage.setFooter(
                'OpenWeatherAPI',
                'https://openweathermap.org/themes/openweathermap/assets/img/openweather-negative-logo-RGB.png',
            )
        message.channel.send(weatherEmbeddedMessage)
    })
}