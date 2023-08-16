'use strict';

const axios = require('axios');

let getMovies = async (req, res) => {
  console.log(req.query.searchQuery);
  let location = req.query.location;
  let params = {
    api_key: process.env.MOVIE_API_KEY,
    language: 'en-US',
    page: '1',
    query: location
  };

  let movieUrl = 'https://api.themoviedb.org/3/search/movie';
  let movieData = await axios.get(movieUrl, { params });

  console.log(movieData.data.results);

  try {
    let movieArray = movieData.data.results.map(movie => new Movie(movie));
    res.status(200).send(movieArray);
    console.log(movieArray);
  } catch (error) {
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
  }
};

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
