'use strict';

const axios = require('axios');


const yelpAPIKey = process.env.YELP_API_KEY;

const getYelpData = async (req, res) => {
  try{
    const {lat, lon} = req.query;
    const yelpUrl = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}`;
    const headers = {
      Authorization: `Bearer ${yelpAPIKey}`,
    };
    const response = await axios.get(yelpUrl, { headers });
    const yelpArr = response.data.businesses.map(restaurant => new Yelp(restaurant));
    res.status(200).send(yelpArr);
  } catch(e) {
    return Promise.reject(e);
  }
};

class Yelp {
  constructor(restaurant) {
    this.name = restaurant.name;
    this.image_url = restaurant.image_url;
    this.price = restaurant.price;
    this.rating = restaurant.rating;
    this.url = restaurant.url;
  }
}

module.exports = getYelpData;
