'use strict'

const mongoose = require('mongoose')

const fighterSchema = require('./schemas/fighterSchema')

const fighterModel = mongoose.model('mma-figthers', fighterSchema)

module.exports = fighterModel
