console.log('Our first server');


// Require
const express = require('express');

require('dotenv').config();

const cors = require('cors');

const getMovies = require('./modules/movies');

const getWeather = require('./modules/myWeather');


// Use
const app = express();
app.use(cors());


// Port
const PORT = process.env.PORT || 3002;

// Routes
app.get('/', (request, response) => {
  response.send('hello, from our server');
});

app.get('/weather', getWeather);

// function errorHandler (error, response) {
//   response.status(500).send(`There is an error finding weather for the searched city: ${error.message}`);
// }

app.get('/movies', getMovies);


app.get('*', (request, response) => {
  response.send('the thing you are looking for does not exist');
});

// Errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
  next();
});


// Listen
app.listen(process.env.PORT, () => console.log(`listening on ${PORT}`));
