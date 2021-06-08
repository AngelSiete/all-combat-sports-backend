'use strict'

const express = require('express')

//Middlewares con las rutas
// const indexController = require('./controllers/indexController')
// const articleController = require('./controllers/articleController')
// const userController = require('./controllers/usersControllers')
// const authController = require('./controllers/authController')
const database = require('./modules/database')

const app = express()

const axios = require('axios').default;
// https://fly.sportsdata.io/v3/mma/scores/json/Fighter/140000001
// https://fly.sportsdata.io/v3/mma/scores/json/Fighters
axios.get('https://fly.sportsdata.io/v3/mma/scores/json/Fighter/140000001', {
  params: {
    'key': `e0cabb2c7777467abee62aadef1762e6`
  }})
  .then(function (response) {
    // handle success
    const nicknames = [];
    nicknames.push(response.data.Nickname)

    console.log(nicknames);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
app.use(express.json())
// require('./modules/authenticator')

// app.use(indexController)
// app.use(articleController)
// app.use(userController)
// app.use(authController)

// database.connect()

module.exports = app
