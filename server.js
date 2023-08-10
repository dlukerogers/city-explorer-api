console.log('Our first server');


// Require
const express = require('express');

require('dotenv').config();


const cors = require('cors');

const axios = require('axios');


// Use
const app = express();
app.use(cors());


// Port
const PORT = process.env.PORT || 3002;

// Routes
app.get('/', (request, response) => {
  response.send('hello, from our server');
});

app.get('/weather', async (req, res) => {
  console.log(req.query);
  // .lat can be called for anything; what are query parameter is "?city=..."
  let lat = req.query.lat;
  let lon = req.query.lon;
  console.log(lat, lon);
  let weatherDataURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=7&units=I`;
  let weatherData = await axios.get(weatherDataURL);

  // let choiceWeatherData = weatherData.data.find((forecast) => forecast.lat === lat && forecast.lon === lon);
  console.log('weatherData: ', weatherData);

  try {
    const weatherArr = weatherData.data.data.map(day => new Forecast(day));
    res.status(200).send(weatherArr);
    console.log(weatherArr);
  } catch (error) {
    errorHandler(error, res);
  }
});

function errorHandler (error, response) {
  response.status(500).send(`There is an error finding weather for the searched city: ${error.message}`);
}

app.get('/movies', async (req, res) => {
  console.log(req.query.searchQuery);
  let location = req.query.location;
  let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&query=${location}`;
  let movieData = await axios.get(movieUrl);

  console.log(movieData.data.results);

  try {
    let movieArray = movieData.data.results.map(movie => new Movie(movie));
    res.status(200).send(movieArray);
    console.log(movieArray);
  } catch (error) {
    errorHandler(error, res);
  }

}); // add a try catch in here as well

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

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = movie.poster_path;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}

// Errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
  next();
});


// Listen
app.listen(PORT, () => console.log(`listening on ${PORT}`));
