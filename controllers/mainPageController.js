'use strict'

const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const fighterModel = require('../models/fighterModel')
const fightModel = require('../models/fightModel')
const fightBoxingModel = require('../models/fightBoxingModel')

// //
//   Toma como parámetro el Nombre del luchador a buscar
//   VALIDACIÓN DEL NOMBRE
//   Devuelve una lista de luchadores segun el FighterSchema
//
router.route("/luchador/:nombre").get(async(req, res) =>{
  // PARÁMETROS
  if(!nameValidator(req.params.nombre)){
    res.json({
      "success":false,
      "metadata":{"errorMsg": "No es un nombre válido"}
    });
    return;
  }
  // DB
  try{
  let apellido = req.params.nombre;
  const filterParams = {LastName: apellido}
  const fightersByNameList = await fighterModel
      .find(filterParams)
      .sort({ LastName: 'ASC'})
      .exec()
  // CREAMOS EL JSON DE RESPUESTA ESTÁNDAR
  let fightersByNameCustomList = []
   fightersByNameList.forEach(luchador =>{
    fightersByNameCustomList
      .push(
        {
          id: luchador.id,
          FirstName: luchador.FirstName,
          LastName: luchador.LastName,
          WeightClass: luchador.WeightClass
        }
      )
  })
  res.json({
    "success":true,
    "metadata":{},
    "data": fightersByNameCustomList
  })}
  catch{ res.status(500).json(
    {
    "success": false,
    "metadata":
      {
        message: error.message
      }
    }
    );

  }
});


router.route('/luchadores')
  .get(async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 30
      const filterParams = {}

      // if (!req.tokenData || req.tokenData.profile === 'user') {
      //   filterParams.enabled = true
      // }

      const fightersList = await fighterModel
      .find(filterParams)
      .sort({ LastName: 'ASC'})
      .limit(limit)
      .exec()
      let fightersCustomList = []
      fightersList.forEach(luchador =>{
        fightersCustomList
          .push(
            {
              id: luchador.id,
              FirstName: luchador.FirstName,
              LastName: luchador.LastName,
              WeightClass: luchador.WeightClass
            }
          )
      })
      let result = {
        "success": true,
        "metadata": {},
        "data": fightersCustomList,
      }
      res.json(result)
    } catch (error) {
      res.status(500).json(
        {
        "success": false,
        "metadata":
          {
            message: error.message
          }
        }
        );
    }
  })
// Este endpoint busca en la base de datos y trae TODAS las peleas (MMA y boxeo) juntas de TODOS los luchadores.Paginado de 30 en 30 (fijo). NO FILTRA POR CERCANÍA EN EL TIEMPO.
router.route('/luchas')
.get(async(req,res) =>{
  try {
    const limit = 30
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
    res.status(500).json(
      {
      "success": false,
      "metadata":
        {
          message: error.message
        }
      }
      );
  }
})



//
// Otro ENDPOINT que nos busca en las LUCHAS y nos filtre las más cercanas en el tiempo (EN FUTURO). Paginado de 10 en 10
//
// PIDE: la lastPageID -> para paginación, puede ser nulo
//DEVUELVE: las primeras 10 peleas que encuentra A PARTIR de lastpageID(default:las 10 primeras)
router.route("/calendario")
.get(async(req,res)=>{
  try {


  // LASPAGEID PARA PAGINACION
  let lastPageID = req.query.hasOwnProperty('pageID') ? req.query.pageID : null

  let now = new Date();
  let inAweek = new Date();
  inAweek.setDate(inAweek.getDate() + parseInt(7))
  let filterParams = {
    DateTime : {
      $gte: now.toISOString(),
      $lt: inAweek.toISOString(),
    }
  }
  let combinedFights = []
  // LLAMAMOS, FILTRAMOS, AÑADIMOS PELEAS DE MMA
  const fightList = await fightModel
  .find(filterParams)
  .sort({ DateTime: 'ASC'})
  .exec()
  combinedFights.push(fightList)
  // LLAMAMOS, FILTRAMOS, AÑADIMOS PELEAS DE BOXEO
  const fightBoxingList = await fightBoxingModel
  .find(filterParams)
  .sort({ DateTime: 'ASC'})
  .exec();
  combinedFights.push(fightBoxingList)
  res.send(combinedFights);
} catch (error) {
  res.status(500).json(
    {
    "success": false,
    "metadata":
      {
        message: error.message
      }
    }
    );
}
})
//

function nameValidator(input) {
  if (!typeof input == "string"){
    return false
  };
  if(input.length < 3){
    return false
  }
  else return true

}
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
