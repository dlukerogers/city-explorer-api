'use strict';

const axios = require('axios');

let getWeather = async (req, res, next) => {
  // console.log(req.query);
  // .lat can be called for anything; what are query parameter is "?city=..."
  let lat = req.query.lat;
  let lon = req.query.lon;
  // console.log(lat, lon);
  let params = {
    key: process.env.WEATHER_API_KEY,
    lat: lat,
    lon: lon,
    days: '7',
    units: 'I',
  };
  let weatherDataURL = 'http://api.weatherbit.io/v2.0/forecast/daily';
  let weatherData = await axios.get(weatherDataURL, { params });

  // let choiceWeatherData = weatherData.data.find((forecast) => forecast.lat === lat && forecast.lon === lon);
  // console.log('weatherData: ', weatherData);

  try {
    const weatherArr = weatherData.data.data.map(day => new Forecast(day));
    res.status(200).send(weatherArr);
    // console.log(weatherArr);
  } catch (error) {
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
  }
};

class Forecast {
  constructor(forecastObject) {
    this.description = `Low of ${forecastObject.low_temp}, high of ${forecastObject.high_temp} with ${forecastObject.weather.description.toLowerCase()}`;
    this.date = forecastObject.valid_date;
  }
}

module.exports = getWeather;
