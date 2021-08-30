// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const fetch = require("node-fetch")

const handler = async (event) => {
  const city = 'Warsaw'
  const lang = 'en'
  const WEATHER_KEY = process.env.WEATHER_KEY
  try {
    let request = fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_KEY}&q=${city}&lang=${lang}&days=3`)
    const data = await request
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = { handler }
