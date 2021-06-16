'use strict'

const config = require('./modules/config')
const app = require('./app')
//
const PORT = process.env.PORT ||

app.listen(PORT, () => console.info(`Servidor en http://localhost:${PORT}`))
