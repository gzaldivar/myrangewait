var mongoose = require('mongoose');

var BlogSchema = new mongoose.Schema({
  user : String,
  gunrange: String,
  waittime: Number,
  comment: String,
  lastUpdate: { type: Date, default: Date.now },
});

module.exports  = mongoose.model('Blog', BlogSchema);
