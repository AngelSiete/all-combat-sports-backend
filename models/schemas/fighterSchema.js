const { Schema } = require("mongoose")

const fighterSchema = new Schema({
  FirstName:{type: String},
  LastName:{type: String},
  Nickname:{type: String},
  WeightClass:{type:String}

})

module.exports = fighterSchema
