
const mongoose = require('mongoose')
const config = require('./config')

class Database {
  constructor() {
    this.db = null
  }

  async connect() {
    mongoose.set("runValidators", true)
    this.db = mongoose.connection;

    try {
            await mongoose.connect(proces.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
      console.log('Estamos conectados a MongoDB')
    }
    catch(error) {
      console.info('Error al conectar con la base de datos')
      console.error(error)
    }
  }
}

module.exports = new Database()
