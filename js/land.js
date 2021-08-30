import langs from '../languages/land.index.js'

export default function land(data, coords, lang) {
    document.querySelector('.loader').style.display = "none"
    document.querySelector('.wrapper').style.display = "flex"
    const { lat, long } = coords
    const tempRadioC = document.getElementById('temp-c-input')
    const tempRadioF = document.getElementById('temp-f-input')
    const topbarTemp = document.getElementsByClassName('topbar__temp')
    translator(lang)
    temperatures('c', data)
    topbarTemp[0].addEventListener('click', e => {
        if (e.target.id === 'temp-c-input') {
            tempRadioC.checked = true
            tempRadioF.checked = false
            temperatures('c', data)
        }else if (e.target.id === 'temp-f-input') {
            tempRadioC.checked = false
            tempRadioF.checked = true
            temperatures('f', data)
        }
    })
    const dateTime = document.getElementById('weather__date')
    const cityName = document.getElementById('weather__city-name')
    const windSpeed = document.getElementById('wind-speed')
    const humidityLevel = document.getElementById('humidity-level')

    const dayOfWeek1 = document.getElementById('future__week-day1')
    const dayOfWeek2 = document.getElementById('future__week-day2')
    const dayOfWeek3 = document.getElementById('future__week-day3')

    const weatherSign = document.getElementsByClassName('weather__sign')
    const condition = document.getElementById('condition')
    document.getElementById('map__coords_lat').textContent = lat
    document.getElementById('map__coords_long').textContent = long
    const { name, country, tz_id, } = data.location
    const { wind_kph, humidity } = data.current

    const arrOfDays = [dayOfWeek1, dayOfWeek2, dayOfWeek3];
    for (let i = 0; i < 3; i++) {
        const date = data.forecast.forecastday[i]?.date
        arrOfDays[i].textContent = dayOfWeek(tz_id, date, lang)
    }

    weatherSign[0].src = data.current.condition.icon
    condition.textContent = data.current.condition.text
    humidityLevel.textContent = humidity
    windSpeed.textContent = wind_kph
    cityName.textContent = `${name}, ${country}`
    dateTime.textContent = date(tz_id)
}

function date(tz) {
    const date = new Date;
    const options = { weekday: 'short', day: 'numeric', month: 'long', minute: '2-digit', hour: '2-digit', hourCycle: 'h24', timeZone: tz };
    return date.toLocaleDateString('en-US', options)
}

function dayOfWeek(tz, date, lang) {
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: tz })
    return lang === 'ru' ? langs.ru[day] : day
}

function translator(lang) {
    const arrOfElems = ['search-bar','submit-text','feels-like-text','wind-text','humidity-text','lat','lon',]
    const translatorHelper = (name, lang, property = 'innerText') => {
        document.getElementById(name)[property] = langs[lang][name]
    }
    for (let i of arrOfElems) {
        (i === 'search-bar') 
        ? translatorHelper(i, lang, 'placeholder')
        : translatorHelper(i, lang)
    }
}

function temperatures(u, data) {
    const temp = Math.round(data.current[`temp_${u}`])
    document.getElementById('weather__temp-deg').textContent = temp;
    document.getElementById('feels-like').textContent = data.current[`feelslike_${u}`]
    try {
        document.getElementById('future__day1').textContent = data.forecast.forecastday[0].day[`avgtemp_${u}`]
        document.getElementById('future__day2').textContent = data.forecast.forecastday[1].day[`avgtemp_${u}`]
        document.getElementById('future__day3').textContent = data.forecast.forecastday[2].day[`avgtemp_${u}`]
    } catch {
        console.log('No forecast data')
    }
}

