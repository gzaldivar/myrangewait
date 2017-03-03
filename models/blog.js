var mongoose = require('mongoose');

var BlogSchema = new mongoose.Schema({
  user : String,
  postedby: String,
  waittime: Number,
  lastUpdate: { type: Date, default: Date.now },
});

module.exports  = mongoose.model('Blog', BlogSchema);
