'use strict'

const express = require('express')
const cors = require("cors");
const indexController = require('./controllers/indexController')
const mainPageController = require('./controllers/mainPageController')
const userController = require('./controllers/usersControllers')
const authController = require('./controllers/authController')
const database = require('./modules/database')
const bearerToken = require('express-bearer-token');

const app = express()

app.use(express.json())
require('./modules/authenticator')
app.use(bearerToken())
app.use(cors())
app.use(indexController)
app.use(mainPageController)
app.use(userController)
app.use(authController)
app.get("/", express.static(__dirname + "/public"))
database.connect()


module.exports = app
