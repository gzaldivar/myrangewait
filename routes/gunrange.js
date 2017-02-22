var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');

var mongoose = require('mongoose');
var Gunrange = require('../models/gunrange.js');

/* GET /gunrange listing. */
router.get('/', function(req, res, next) {
  Gunrange.find(function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

/* GET /gunrange/id */
router.get('/:id', function(req, res, next) {
  var ObjectId = require('mongoose').Types.ObjectId;
  var query = { zip: new ObjectId(req.query.zip) };
  console.log("search by id");
  Gunrange.findById(req.params.id, function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

/* GET /gunrange/name */
router.get('/search/getbyzip', function(req, res, next) {
  Gunrange.find({ zip: req.query.zip }, function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

/* GET /gunrange/state */
router.get('/search/state', function(req, res, next) {
  console.log("Search by state");
  var query = new RegExp(urlencode(req.query.state), "i");
  console.log(query);
  Gunrange.find({ state: query }, function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

/* GET /gunrange/name */
router.get('/search/name', function(req, res, next) {
  console.log("Search by name");
  var query = new RegExp(urlencode(req.query.name), "i");
  console.log(query);
  Gunrange.find({name: query}, function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

/* POST /Gunrange */
router.post('/', function(req, res, next) {
  console.log('adding a range');
  console.log(req.body);
  Gunrange.create(req.body, function (err, post) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      res.json(post);
    }
  });
});

/* PUT /Gunrange/:id */
router.put('/:id', function(req, res, next) {
  console.log('updating a range');
  return Gunrange.findById(req.params.id, function(err, range){

    range.name = req.body.name;
    range.addressNumber = req.body.addressNumber;
    range.street = req.body.street;
    range.name = req.body.name;
    range.addressNumber = req.body.addressNumber;
    range.street = req.body.street;
    range.city = req.body.city;
    range.state = req.body.state;
    range.zip = req.body.zip;
    range.phone = req.body.phone;

    return range.save(function(err){
      if (!err) {
        console.log("updated: " + range.name);
        res.json(range);
      } else {
        console.log(err);
        return next(err);
      }
    })
  })
});

/* DELETE /Gunrange/:id */
router.delete('/:id', function(req, res, next) {
  Gunrange.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
