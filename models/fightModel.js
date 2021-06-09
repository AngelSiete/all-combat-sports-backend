'use strict'

const mongoose = require('mongoose')

const fightSchema = require('./schemas/fightSchema')

const fightModel = mongoose.model('mma-fights', fightSchema)

module.exports = fightModel
