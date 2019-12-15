let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = mongoose.Schema.Types.ObjectId;

let photoSchema = new Schema({
  url: String,
  userID: ObjectId,
  likedBy: [ObjectId],
});

module.exports = mongoose.model("Photo", photoSchema);