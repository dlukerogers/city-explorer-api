'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const weather = require('./modules/weather.js');
const movie = require('./modules/movies');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

function movieHandler(request, response) {
  const location = request.query.location;
  movie(location)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}



app.listen(process.env.PORT, () => console.log(`Server up on ${PORT}`));
