const { Schema } = require("mongoose")
//const slugify = require('slugify')

const ArticleSchema = new Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 255 },
  slug: { type: String, required: true, minlength: 3, maxlength: 255, unique: true },
  user: {
    type: Schema.Types.ObjectId, ref: 'user' },
  votes: {type: Number, default: 0},
  published_at: {type: Date, default: Date.now},
  category: { type: String, required: true, enum: ['Actualidad', 'Egiptología', 'Videojuegos', 'Ecologismo',"Literatura"] },
  enabled: { type: Boolean, default: true },
  body:{type: String, required: true,minlength: 3, maxlength: 500},
  comments: [{type: Schema.Types.ObjectId, ref: 'comments' }]
})


module.exports = ArticleSchema
