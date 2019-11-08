const Discord = require('discord.js')
const client = new Discord.Client()
const fetch = require('node-fetch')
const { URL, URLSearchParams } = require('url')
const constants = require('../../utils/weather.constants')

const {     
    CURRENT_WEATHER_URL,
    OPEN_WEATHER_API_KEY,
    DEFAULT_WEATHER_RESULT_UNIT,
    BOT_THUMBNAIL_URL,
    GITHUB_PROJECT_URL,
    OPEN_WEATHER_THUMBNAIL,
} = process.env

const {
    WIND_DIRECTIONS,
} = constants

const getMeteorologicalDegreeDirection =  (degree) => {
    for (const windDirection of WIND_DIRECTIONS) {
        if (degree >= windDirection.min && degree < windDirection.max)
            return windDirection.value
    }
    return null
}

const getEmbeddedMessage = (parsedWeather, city) => {
    const weatherEmbeddedMessage = new Discord.RichEmbed()
    .setTitle(`Weather in ${parsedWeather.name}`)
    .setURL(`https://openweathermap.org/find?q=${city}`)
    .setAuthor(
            'Mattness_bot',
            BOT_THUMBNAIL_URL,
            GITHUB_PROJECT_URL
        )
    .setColor('#eb6e4b')
    .setThumbnail(OPEN_WEATHER_THUMBNAIL)
    .setDescription(`
        Temperature : ${parsedWeather.main.temp}°C\n
        Minimum: ${parsedWeather.main.temp_min}°C\n
        Maximum: ${parsedWeather.main.temp_max}°C\n
        Humidity: ${parsedWeather.main.humidity}%\n
        Wind: ${parsedWeather.wind.speed} meter/sec, ${(parsedWeather.wind.speed * 3.6).toFixed(2)} km/h,\
         ${parsedWeather.wind.deg}\
        degrees (${getMeteorologicalDegreeDirection(parsedWeather.wind.deg)})\n
        Cloudiness : ${parsedWeather.clouds.all}%\n
    `)
    parsedWeather.weather.forEach(weather => {
        weatherEmbeddedMessage.addField(weather.main, weather.description)
        .setImage(`http://openweathermap.org/img/wn/${weather.icon}@2x.png`)
    })
    weatherEmbeddedMessage.setFooter(
        'OpenWeatherAPI',
        OPEN_WEATHER_THUMBNAIL,
    )
    return weatherEmbeddedMessage
}

const getCurrentWeather = async message => {
    const opt = message.content.split(' ')
    const url = new URL(CURRENT_WEATHER_URL)
    url.search = new URLSearchParams({
        q: opt[1],
        appid: OPEN_WEATHER_API_KEY,
        units: DEFAULT_WEATHER_RESULT_UNIT,
    }).toString()
    try {
        const response = await fetch(url)
        const parsedWeather = await response.json()
        message.channel.send(getEmbeddedMessage(parsedWeather, opt[1]))
    }
    catch (error) {
        throw error
    }
}

module.exports = {
    getCurrentWeather,
}