var mongoose = require('mongoose');

var Poster = new mongoose.Schema({
  postedby: String,
  waittime: Number,
  lastUpdate: { type: Date, default: Date.now },
});

var GunStall = new mongoose.Schema({
  stalltype : { type: String, enum: ['Pistol', 'Rifle', 'Shotgun'] },
  numberofstalls : Number,
  length: Number
});

var GunRangeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  addressNumber: Number,
  street: String,
  city: String,
  state: { type: String, required: true },
  zip: String,
//  areacode: Number,
//  prefix: Number,
//  number: Number,
  phone: String,
  rangetype: { type: String, enum: ['Indoor', 'Outdoor'] },
  waitposts : [Poster],
  stalls: [GunStall],
  note: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gunrange', GunRangeSchema);
