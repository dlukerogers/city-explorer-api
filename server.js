'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const weather = require('./modules/weather.js');
const movie = require('./modules/movies');
const yelp = require('./modules/yelp.js');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);
app.get('/yelp', yelp);


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


app.listen(PORT, () => console.log(`Server up on ${PORT}`));
