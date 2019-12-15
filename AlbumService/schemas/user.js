let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = mongoose.Schema.Types.ObjectId;

let userSchema = new Schema({
  username: String,
  password: String,
  friends: [String],
});

module.exports = mongoose.model("User", userSchema);