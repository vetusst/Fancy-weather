import { get } from './storage.js'

export async function getCity() {
    try {
        // Getting IP via WebRTC
        const ip = await getIPs().then(res => res[0]).catch(res => console.log('WebRTC is hidden')) // TODO fix error
        if (ip) {
            // Request to IP -> city API 
            const cityData = await fetch(`https://ipapi.co/${ip}/json/`).then((res) => res.json())
            return { city: cityData.city, lat: cityData.latitude, long: cityData.longitude }
        } else {
            // Getting coords from browser (if WebRTC is hidden)
            const { latitude, longitude } = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(position => resolve(position.coords), reject);
            });
            if (latitude && longitude) {
                // Request to coords -> city API
                const cityData = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&accept-language=en&format=json`).then(res => res.json())
                return { city: cityData.address.city, lat: latitude, long: longitude }
            } else {
                // No coords got , setting city to London
                navigator.permissions.query({ name: 'geolocation' }).then(res => {
                    if (res.state === 'denied' || res.state === "prompt") {
                        alert('Please, share your geolocation in browser settings and reload the page.')
                        return { city: 'London', lat: '51.509865', lon: '-0.118092' }
                    }
                });
            }
        }
    } catch (e) {
        console.log(e)
    }
}

export const getWeather = async (locationData) => {
    const {city, lat, long} = locationData

    const lang = get('Language')

    // Request to weather api
    let weatherData = await fetch(`/.netlify/functions/fetch-weather/handler?city=${city}&lang=${lang}`).then(res => res.json())

    return {weatherData: weatherData, coords: {lat: lat, long: long }, city: city}
};