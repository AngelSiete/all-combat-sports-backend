'use strict'

const express = require('express')
const router = express.Router()
const axios = require('axios').default;

router.route('/')
  .get((req, res) => {
    const now = new Date()
    const indexMessage = `All Combat Sports v1.0.0, todos los derechos reservados ${now.getFullYear()}.`
    res.send(indexMessage)
  })


// https://fly.sportsdata.io/v3/mma/scores/json/Fighter/140000001
// https://fly.sportsdata.io/v3/mma/scores/json/Fighters
//https://fly.sportsdata.io/v3/mma/scores/json/Leagues
axios.get('https://fly.sportsdata.io/v3/mma/scores/json/Fighter/140000001', {
  params: {
    'key': process.env.sportsdata_API_KEY}})
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

module.exports = router
