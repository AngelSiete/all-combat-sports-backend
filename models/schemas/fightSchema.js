const { Schema } = require("mongoose")

const fightSchema = new Schema({
  Name:{type: String},
  ShortName:{type: String},
  Day:{type: String},
  DateTime:{type: String},
  Season:{type: Number}



})

module.exports = fightSchema
