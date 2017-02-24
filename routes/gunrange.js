var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');
var nodeGeocoder = require('node-geocoder');

var mongoose = require('mongoose');
var Gunrange = require('../models/gunrange.js');

var options = {
  provider: 'google',
  formatter: null
  }

var geocoder = nodeGeocoder(options);

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
  console.log("zip= ", req.query.zip);
  console.log("distance= ", req.query.distance);

  var limit = req.query.limit || 10;

  // get the max distance or set it to 8 kilometers
  var maxDistance = (req.query.distance * 1.60934) || 8;

console.log("maxDistance= " + maxDistance);
  // we need to convert the distance to radians
  // the raduis of Earth is approximately 6371 kilometers
  maxDistance /= 6371;

  geocoder.geocode(req.query.zip, function (err, georesult) {
    if (err) {
      console.log(err);
    } else {
      console.log("longitude= " + georesult[0].longitude + " latitude= " + georesult[0].latitude +
    " maxdistance= " + maxDistance);
      Gunrange.find({ loc:
        {
          "$near": [georesult[0].longitude, georesult[0].latitude],
          "$maxDistance": maxDistance
        }
      })
      .limit(limit)
      .exec(function(err, docs) {
        if (err) {
          res.status(404).send(err);
        } else {
          if (docs.length > 0) {
            docs.message = "Results of search"
            res.json(docs);
          } else {
            res.json({ status: 200, message: "No results found"});
          }
        }
      });
    }
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
  var address = req.body.addressNumber + " " + req.body.street + " " + req.body.city;

  geocoder.geocode(address, function (err, georesult) {
    if (err) {
      console.log(err);
    } else {

      var range = createRange(req, georesult);

      if (range == null) {
        res.status(404).send({ error: "Address counld not be found"});
      } else {

        Gunrange.create(range, function (err, post) {
          if (err) {
            res.json(err);
          } else {
            res.json(post);
          }
        });
      }
    }
  });
});

/* PUT /Gunrange/:id */
router.put('/:id', function(req, res, next) {
  return Gunrange.findById(req.params.id, function(err, range){

    var address = req.body.addressNumber + " " + req.body.street + " " + req.body.city;

    geocoder.geocode(address, function (err, georesult) {
      if (err) {
        console.log(err);
      } else {

        range = createRange(req, georesult);

        if (range == null) {
          res.status(404).send({ error: "Address counld not be found"});
        } else {

          return range.save(function(err){
            if (!err) {
              console.log("updated: " + range.name);
              res.json(range);
            } else {
              console.log(err);
              return next(err);
            }
          });
        }
      }
    });
  })
});

var createRange = function(req, georesult) {
  var result = null;

  if (georesult.length > 1) {
    for (i = 0; i < georesult.length; i++) {
      if (georesult[i].countryCode === "US") {
        result = georesult[i];
        break;
      }
    }
  } else if (georesult[0].countryCode === "US") {
    result = georesult[0];
  }

  if (result == null) {
    return null;
  }

  return range = {
    name : req.body.name,
    addressNumber : result.streetNumber,
    street : result.streetName,
    addressNumber : req.body.addressNumber,
    street : req.body.street,
    city : result.city,
    state : req.body.state,
    zip : result.zipcode,
    loc : [result.longitude, result.latitude],
    phone : req.body.phone,
    rangetype : req.body.rangetype,
    stalls : req.body.stalls
  }
}

/* DELETE /Gunrange/:id */
router.delete('/:id', function(req, res, next) {
  Gunrange.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
