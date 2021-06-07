const { Schema } = require("mongoose")

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, ref: 'User' },
  votes: {type: Number, default: 0},
  published_at: {type: Date, default: Date.now},
  enabled: { type: Boolean, default: true },
  text:{type: String, required: true,minlength: 3, maxlength: 500}
})

module.exports = CommentSchema
