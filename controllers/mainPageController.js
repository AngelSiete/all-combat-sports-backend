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
router.route("/API/luchador/:apellido").get(async(req, res) =>{
  // PARÁMETROS
  if(!nameValidator(req.params.apellido)){
    res.json({
      "success":false,
      "metadata":{"errorMsg": "No es un nombre válido"}
    });
    return;
  }
  // DB
  let data = [];
  let apellido = req.params.apellido;
  const filterParams = {LastName: apellido}
  try{

  // BUSCAR SIEMPRE CON LA PRIEMRA LETRA DEL APELLIDO EN MAYUSCULA
  const fightersByNameList = await fighterModel
      .find(filterParams)
      .exec()
  //BUSCAMOS LAS PELEAS DE ESE LUCHADOR
  const fightsByNameList = await fightModel
      .find( { 'Name': { "$regex": apellido } } )
      .sort({ Day: 'DESC'})
      .exec();
  const fightsBoxByNameList = await fightBoxingModel
  .find( { 'Name': { "$regex": apellido } } )
  .sort({ Day: 'DESC'})
  .exec();

  // CREAMOS EL JSON DE RESPUESTA ESTÁNDAR
  let fightersByNameCustomList = []
   fightersByNameList.forEach(luchador =>{
    fightersByNameCustomList
      .push(
        {
          id: luchador.id,
          FirstName: luchador.FirstName,
          LastName: luchador.LastName,
          Nickname: luchador.Nickname,
          WeightClass: luchador.WeightClass,
          PeleasMMA: fightsByNameList,
          PeleasBox: fightsBoxByNameList
        }
      )
  })

  data.push(fightersByNameCustomList[0] )
  res.send(createSuccessResponse(data, {"numElements": data.length}))}
  catch (error) {
    res.status(500).json(
      res.send(createErrorResponse(error.data))
      );
  }
});


router.route('/API/luchadores')
  .get(async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50
      const filterParams = {}

      // if (!req.tokenData || req.tokenData.profile === 'user') {
      //   filterParams.enabled = true
      // }
      const fightersList = await fighterModel
      .find(filterParams)
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
              WeightClass: luchador.WeightClass,
              Nickname: luchador.Nickname
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
            message: error.message,
            env: process.env
          }
        }
        );
    }
  })
// Este endpoint busca en la base de datos y trae TODAS las peleas (MMA y boxeo) juntas de TODOS los luchadores.Paginado de 30 en 30 (fijo). NO FILTRA POR CERCANÍA EN EL TIEMPO.
// Vamos a filtrar para que devuelva al FRONT listado de peleas específicas -> SÓLO BOXEO // SÓLO MMA// TODAS
router.route('/API/luchas/:tipo')
.get(async(req,res) =>{
  let criterio = req.params.tipo;
  if (!fightTypeValidator(criterio)){
    res.send(createErrorResponse(`El criterio ${criterio} no es válido`))
    return;
  }
  try{
    let data = [];
    if(criterio === "box" || criterio  === "todos"){
      const boxFightsList = await fightBoxingModel.find().sort({ Day: 'DESC'}).exec();
      data.push(...boxFightsList);
    }
    if(criterio === "mma" || criterio === "todos"){
      const mmaFightList =  await fightModel.find().sort({ Day: 'DESC'}).exec();
      const mmaFights = mmaFightList.map((lucha) =>{
        return {id: lucha.id, Name: lucha.Name, ShortName: lucha.ShortName, DateTime: lucha.DateTime, Season: lucha.Season}
      })
      data.push(...mmaFights);
    }

    res.send(createSuccessResponse(data, {"numElements": data.length}));
  }
  catch(e){
    res.send(createErrorResponse(e.data))
  }

})



//
// Otro ENDPOINT que nos busca en las LUCHAS y nos filtre las más cercanas en el tiempo (EN FUTURO). Paginado de 10 en 10
//
// PIDE: la lastPageID -> para paginación, puede ser nulo
//DEVUELVE: las primeras 10 peleas que encuentra A PARTIR de lastpageID(default:las 10 primeras)
router.route("/API/calendario")
.get(async(req,res)=>{
  try {


  // LASPAGEID PARA PAGINACION
  // let lastPageID = req.query.hasOwnProperty('pageID') ? req.query.pageID : 0

  let now = new Date();
  let inAweek = new Date();
  inAweek.setDate(inAweek.getDate() + parseInt(7))
  let filterParams = {
    DateTime : {
      $gte: now.toISOString(),
      $lt: inAweek.toISOString(),
    }
  }
  let data = []
  // LLAMAMOS, FILTRAMOS, AÑADIMOS PELEAS DE MMA
  const fightList = await fightModel
  .find(filterParams)
  .limit()//estaba en : (1)
  .sort({ DateTime: 'ASC'})
  .exec()
  data.push(...fightList)
  // LLAMAMOS, FILTRAMOS, AÑADIMOS PELEAS DE BOXEO
  const fightBoxingList = await fightBoxingModel
  .find(filterParams)
  .sort({ DateTime: 'ASC'})
  .exec();
  data.push(...fightBoxingList)
  res.send(createSuccessResponse(data));
} catch (error) {
  res.status(500).json(
    res.send(createErrorResponse(error.data))
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
function fightTypeValidator(input){
  if (input === "mma" ||input === "box" || input === "todos"   ){
    return true
  }
  else return false
}

function createErrorResponse(msg){
  return {
    "sucess": false,
    "metadata":{
      "msg": msg
    }
  }
}

function createSuccessResponse(data, metadata){
  return {
    "success": true,
    "metadata": metadata,
    "data": data,
  }
}
  module.exports = router


