let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = mongoose.Schema.Types.ObjectId;

let photoSchema = new Schema({
  url: String,
  userID: String,
  likedBy: [String],
});

module.exports = mongoose.model("Photo", photoSchema);