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
    FORECAST_WEATHER_URL,
    MILLISECONDS_IN_ONE_DAY,
    BOT_TOKEN,
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

const getCurrentWeatherEmbeddedMessage = (parsedWeather, city) => {
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

const getForecastWheatherEmbeddedMessage = (forecasts, cityName) => {
    const forecastEmbeddedMessage = new Discord.RichEmbed()
    .setTitle(`Weather in ${cityName} ${forecasts[0].dt_txt.split(' ')[0]}`)
    .setURL(`https://openweathermap.org/find?q=${cityName}`)
    .setAuthor(
        'Mattness_bot',
        BOT_THUMBNAIL_URL,
        GITHUB_PROJECT_URL
    )
    .setColor('#eb6e4b')
    .setThumbnail(OPEN_WEATHER_THUMBNAIL)
    forecasts.forEach((forecast, index) => {
        forecastEmbeddedMessage.addField(
            `${index === 0 ? 'Morning' : 'Afternoon'}`,
            `
                Temperature : ${forecast.main.temp}°C\n
                Minimum: ${forecast.main.temp_min}°C\n
                Maximum: ${forecast.main.temp_max}°C\n
                Humidity: ${forecast.main.humidity}%\n
                Wind: ${forecast.wind.speed} meter/sec, ${(forecast.wind.speed * 3.6).toFixed(2)} km/h,\
                ${forecast.wind.deg}\
                degrees (${getMeteorologicalDegreeDirection(forecast.wind.deg)})\n
                Cloudiness : ${forecast.clouds.all}%\n
            `
        )
        forecast.weather.map(weather => 
            forecastEmbeddedMessage.setImage(`http://openweathermap.org/img/wn/${weather.icon}@2x.png`)
        )
        forecastEmbeddedMessage.setFooter(
            'OpenWeatherAPI',
            OPEN_WEATHER_THUMBNAIL,
        )
    })
    return forecastEmbeddedMessage
}

const getCurrentWeather = async city => {
    const url = new URL(CURRENT_WEATHER_URL)
    url.search = new URLSearchParams({
        q: city,
        appid: OPEN_WEATHER_API_KEY,
        units: DEFAULT_WEATHER_RESULT_UNIT,
    }).toString()
    try {
        const response = await fetch(url)
        const parsedWeather = await response.json()
        return getCurrentWeatherEmbeddedMessage(parsedWeather, city)
    }
    catch (error) {
        throw error
    }
}

const getDateInterval = timeStamp =>
    (
        {
            start: Math.floor(((new Date(timeStamp).setUTCHours(0, 0, 0, 0))) / 1000),
            end: Math.floor((new Date(timeStamp).setUTCHours(23, 59, 59, 999)) / 1000)
        }
    )


const getWeatherForecast = async (city, requestedForecastNumber) => {
    const url = new URL(FORECAST_WEATHER_URL)
    url.search = new URLSearchParams({
        q: city,
        appid: OPEN_WEATHER_API_KEY,
        units: DEFAULT_WEATHER_RESULT_UNIT
    })
    try {
        const response = await fetch(url)
        const parsedWeather = await response.json()
        const interval = getDateInterval(
            Math.floor(((Date.now())) + (parseInt(MILLISECONDS_IN_ONE_DAY) * parseInt(requestedForecastNumber)))
        )
        const result = parsedWeather.list.filter(forecast => {
            const forecastHour = (forecast.dt - interval.start) / 3600
            return (
                (forecast.dt >= interval.start && forecast.dt <= interval.end) &&
                (forecastHour === 9 || forecastHour === 15)
            )
        })
        return getForecastWheatherEmbeddedMessage(result, parsedWeather.city.name)
    }
    catch (error) {
        throw error
    }
}

const sendDailyWeather = async () => {
    try {
        await client.login(BOT_TOKEN)
        const guilds = client.guilds.entries()
        for (const guild of guilds) {
            const channels = guild[1].channels.entries()
            for (channel of channels) {
                const tempChannel = guild[1].channels.get(channel[1].id)
                if (tempChannel.type === 'text' && tempChannel.name === 'météo') {
                    await tempChannel.send(await getWeatherForecast('Lyon', '1'))
                }
            }
        }
        client.destroy()
    }
    catch (error) {
        throw error
    }
}

const getWeather = async message => {
    const opt = message.content.split(' ')
    try {
        if (opt[2] !== undefined) {
            message.channel.send(await getWeatherForecast(opt[1], opt[2]))
        }
        else {
            message.channel.send(await getCurrentWeather(opt[1]))
        }
    }
    catch (error) {
        throw error
    }
}

module.exports = {
    getWeather,
    sendDailyWeather,
}
