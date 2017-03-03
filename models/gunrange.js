var mongoose = require('mongoose');

var GunStallSchema = new mongoose.Schema({
  type : { type: String, enum: ['Pistol', 'Rifle', 'Shotgun'] },
  numberofstalls : Number,
  length: Number
});

var GunRangeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  addressNumber: Number,
  street: String,
  city: String,
  state: { type: String, required: true },
  county: String,
  zip: String,
  loc: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
//  areacode: Number,
//  prefix: Number,
//  number: Number,
  phone: { type: String, default: "(000) 000-0000" },
  rangetype: { type: String, enum: ['Indoor', 'Outdoor'] },
  stalls: [GunStallSchema],
  note: String,
  user: String,
  updated_at: { type: Date, default: Date.now },
});

GunRangeSchema.index({ loc : '2dsphere' });

module.exports = mongoose.model('Gunrange', GunRangeSchema);
