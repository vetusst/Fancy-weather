import { getCity, getWeather } from './location-info.js'
import autocomplete from './search.js'
import render from "./render.js"
import { get, set } from './storage.js'


// Setting default language
if (get('Language') === null) set('Language', 'en');

async function main() {
	// Getting location data
	const locationData = await getCity()
	// Adding event listener on lanugage switch
	const langBar = document.getElementById('topbar__lang')
	langBar.addEventListener('click', e => {
		if (get('Language') !== langBar.value) {
			set('Language', langBar.value)
			getWeather(locationData).then(res => {
				render(res.weatherData, res.coords, langBar.value)
			})
		}
	})
	// Getting weather data
	const weatherData = await getWeather(locationData)
	// Getting language from Local Storage
	const lang = get('Language')
	// Rendering layout
	render(weatherData.weatherData, weatherData.coords, lang)
}
main()

// Turning on autocomplete
autocomplete(document.getElementById('search-bar'))

// Adding event listener on Submit button (search)
const searchBar = document.getElementsByTagName('form')
searchBar[0].addEventListener('submit', e => {
	e.preventDefault();
	const { lat, lon } = searchBar[0][0].dataset
	const city = searchBar[0][0].value
	getWeather({ city: city, lat: lat, long: lon }).then(res => {
		const lang = get('Language')
		render(res.weatherData, res.coords, lang)
	})
})





