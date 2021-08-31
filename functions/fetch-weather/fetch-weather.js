// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const fetch = require("node-fetch")

const handler = async (event) => {
  const { city, lang } = event.queryStringParameters
  const WEATHER_KEY = process.env.WEATHER_KEY
  try {
    const request = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_KEY}&q=${city}&lang=${lang}&days=3`)
    return {
      statusCode: 200,
      body: JSON.stringify(await request.json())
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = { handler }
