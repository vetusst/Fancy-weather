import land from "./land.js"
import autocomplete from './search.js'
import { get, set } from './storage.js'

const main = window.addEventListener("load", () => {
	let long;
	let lat;
	const searchBar = document.getElementsByTagName('form')
	searchBar[0].addEventListener('submit', e => {
		e.preventDefault();
		const { lat, lon } = searchBar[0][0].dataset
		const city = searchBar[0][0].value
		weather(city, { lat: lat, long: lon })
	})

	const langBar = document.getElementById('topbar__lang')
	langBar.addEventListener('click', e => {
		if (get('Language') !== langBar.value) {
			set('Language', langBar.value)
			init()
		}
	})

	const weather = (city, coords) => {
		if (get('Language') === null) {
			set('Language', 'en');
		}
		const lang = get('Language')
		document.getElementById(lang).selected = 'selected'
		document.getElementById('map__img').src = `https://maps.google.com/maps?q=${city}&t=&z=11&ie=UTF8&iwloc=&output=embed`
		let request = fetch(`/.netlify/functions/fetch-weather/handler?city=${city}&lang=${lang}`)
		request
			.then(response => {
				return response.json();
			})
			.then(res => {
				console.log(res)
				const search = document.getElementById('search-bar')
				autocomplete(search)
				land(res, coords, lang)
			}).catch(res => {
				console.log(res)
			});
	};
	function init() {
		getIPs()
			.then((res) => {
				console.log("request to geo api", res);
				fetch(`https://ipapi.co/${res}/json/`).then((res) => res.json())
					.then((data) => {
						console.log(data);
						const { city, latitude, longitude } = data;
						weather(city, { lat: latitude, long: longitude })
					});
			})
			.catch((res) => {
				navigator.geolocation.getCurrentPosition((position) => {
					long = position.coords.longitude;
					lat = position.coords.latitude;
					fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&accept-language=en&format=json`)
					.then(response => response.json()).then(res => {
							const { city } = res.address
							document.getElementById('map__img').src = `https://maps.google.com/maps?q=${city}&t=&z=11&ie=UTF8&iwloc=&output=embed`
							weather(city, { lat: lat, long: long })
						}).catch(res => {
							console.log(res)
						})
				});
				navigator.permissions.query({ name: 'geolocation' }).then(res => {
					if (res.state === 'denied' || res.state === "prompt") {
						weather('London', { lat: '51.509865', long: '-0.118092' })
						alert('Please, share your geolocation in browser settings.')
					}
				})
			});
	}
	init()
});
