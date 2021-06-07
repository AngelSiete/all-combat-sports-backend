const { Schema } = require("mongoose")


let userSchema = new Schema({
  firstName: { type: String, required: true, minlenght: 3, maxlenght: 100 },
  lastName: { type: String, required: true, minlenght: 3, maxlenght: 100 },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlenght: 8, maxlenght: 200 },
  profile: { type: String, required: false, default: 'user' },
  enabled: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.Now}
});

module.exports = userSchema
