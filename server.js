console.log('Our first server');


// Require
const express = require('express');

require('dotenv').config();

let data = require('./data/weather.json');

const cors = require('cors');


// Use
const app = express();
app.use(cors());


// Port
const PORT = process.env.PORT || 3002;

// Routes
app.get('/', (request, response) => {
  response.send('hello, from our server');
});

app.get('/sayHello', (request, response) => {
  console.log(request.query.firstName);
  let firstName = request.query.firstName;
  let lastName = request.query.lastName;
  response.send(`hi ${firstName} ${lastName}`);
});

app.get('/weather', handleWeather);

function errorHandler (error, response) {
  response.status(500).send('Something went wrong.');
}

function handleWeather (request, response) {
  console.log(request.query);
  // .lat can be called for anything; what are query parameter is "?city=..."
  let lat = request.query.lat;
  let lon = request.query.lon;
  console.log(lat, lon);

  let dataFromJSON = data.find(forecast => forecast.lat.toLowerCase() === lat.toLowerCase() && forecast.lon.toLowerCase() === lon.toLowerCase());
  console.log('data: ', dataFromJSON);

  try {
    const weatherArr = dataFromJSON.data.map(day => new Forecast(day));
    response.status(200).send(weatherArr);
    console.log(weatherArr);
  } catch (error) {
    errorHandler(error, response);
  }

}

app.get('*', (request, response) => {
  response.send('the thing you are looking for does not exist');
});

// Classes

class Forecast {
  constructor(forecastObject) {
    this.description = `Low of ${forecastObject.low_temp}, high of ${forecastObject.high_temp} with ${forecastObject.weather.description.toLowerCase()}`;
    this.date = forecastObject.valid_date;
  }
}

// Errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});


// Listen
app.listen(PORT, () => console.log(`listening on ${PORT}`));
