'use strict'

const mongoose = require('mongoose')

const fightSchema = require('./schemas/fightSchema')

const fightBoxingModel = mongoose.model('box-fights', fightSchema)

module.exports = fightBoxingModel
