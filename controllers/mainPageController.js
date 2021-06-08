'use strict'

const express = require('express')
const router = express.Router()
const slugify = require('slugify')
//const axios = require('axios').default;
// https://fly.sportsdata.io/v3/mma/scores/json/Fighter/140000001
// https://fly.sportsdata.io/v3/mma/scores/json/Fighters
//https://fly.sportsdata.io/v3/mma/scores/json/Leagues
//
// LLAMADA CON AXIOS
//
// axios.get('https://fly.sportsdata.io/v3/mma/scores/json/Fighter/140000001', {
//   params: {
//     'key': process.env.sportsdata_API_KEY}})
//   .then(function (response) {
//     // handle success
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
