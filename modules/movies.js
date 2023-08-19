'use strict';

const axios = require('axios');

let cache = require('./cache.js');

let getMovies = async (location) => {
  // console.log(req.query.searchQuery);
  let key = 'movies-' + location;
  let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&query=${location}`;

  if (cache[key] && (Date.now() - cache[key].timeStamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timeStamp = Date.now();
    cache[key].data = axios.get(movieUrl)
      .then(response => parseMovie(response.data));
  }

  return cache[key].data;
};


function parseMovie (movieData) {
  try {
    const movies = movieData.results.map((movie => {
      return new Movie(movie);
    }));
    return Promise.resolve(movies);
  } catch (error) {
    return Promise.reject(error);
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

module.exports = getMovies;

// WITH CHAINING

// axios.get(url, { params })
//   .then(photoData => photoData.data.results.map(pic => new photoData(pic)))
//   .then(picArray => res.status(200).send(picArray))
//   .catch(err => console.error(err));
