'use strict'

const express = require('express')

//Middlewares con las rutas
const indexController = require('./controllers/indexController')
const mainPageController = require('./controllers/mainPageController')
// const articleController = require('./controllers/articleController')
// const userController = require('./controllers/usersControllers')
// const authController = require('./controllers/authController')
const database = require('./modules/database')

const app = express()

app.use(express.json())
// require('./modules/authenticator')

app.use(indexController)
app.use(mainPageController)
// app.use(articleController)
// app.use(userController)
// app.use(authController)

database.connect()


module.exports = app
