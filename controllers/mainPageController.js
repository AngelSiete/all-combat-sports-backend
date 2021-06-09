'use strict'

const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const fighterModel = require('../models/fighterModel')
const fightModel = require('../models/fightModel')
const fightBoxingModel = require('../models/fightBoxingModel')

router.route('/luchadores')
  .get(async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 30
      const filterParams = {}

      // if (!req.tokenData || req.tokenData.profile === 'user') {
      //   filterParams.enabled = true
      // }

      const fightersList = await fighterModel.find(filterParams).sort({ LastName: 'ASC'}).limit(limit).exec()
      let fightersCustomList = []
      fightersList.forEach(luchador =>{
        fightersCustomList.push({id: luchador.id, FirstName: luchador.FirstName, LastName: luchador.LastName, WeightClass: luchador.WeightClass})

      })

      res.json(fightersCustomList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

router.route('/luchas')
.get(async(req,res) =>{
  try {
    const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 30
    const filterParams = {}

    // if (!req.tokenData || req.tokenData.profile === 'user') {
    //   filterParams.enabled = true
    // }

    const fightsList = await fightModel.find(filterParams).sort({ Day: 'DESC'}).limit(limit).exec()
    let fightsCustomList = []
    fightsList.forEach(lucha =>{
      fightsCustomList.push({id: lucha.id, Name: lucha.Name, ShortName: lucha.ShortName, DateTime: lucha.DateTime, Season: lucha.Season})

    })
    const boxFightsList = await fightBoxingModel.find(filterParams).sort({ Day: 'DESC'}).limit(limit).exec()

    res.json({fightsCustomList, boxFightsList})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
  module.exports = router

















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
