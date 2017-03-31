var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');

var mongoose = require('mongoose');
var Blog = require('../models/blog');

var configAuth = require('../config/auth');
var request = require('request');

//const expressJwt = require('express-jwt');
//const jwtAuthenticate = expressJwt({secret : 'server secret'});

// Route to post a comment
router.post('/', function(req, res, next) {
  request.get(authurl(req), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      Blog.create(req.body, function (err, post) {
        if (err) {
          console.log(err);
          res.status(200).send({ error: "Error - " + err.message });
        } else {
          res.json(post);
        }
      });
    } else {
      res.json({ status: 401, "status": "unauthorized" });
    }
  });
});

/* GET /blog/id */
router.get('/:id', function(req, res, next) {
  request.get(authurl(req), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      Blog.findById(req.params.id, function (err, docs) {
        if (err) return next(err);
        res.json(docs);
      });
    } else {
      res.json({ status: 401, "status": "unauthorized" });
    }
  });
});

/* GET /blog */
router.get('/', function(req, res, next) {
  request.get(authurl(req), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      Blog.find(function (err, docs) {
        if (err) return next(err);
        res.json(docs);
      });
    } else {
      res.json({ status: 401, "status": "unauthorized" });
    }
  });
});

/* GET /blog for Gunrange */
router.get('/search/gunrange', function(req, res, next) {
  request.get(authurl(req), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      Blog.find({ gunrange: req.query.gunrange }, function (err, docs) {
        if (err) {
          return res.status(200).send({ error: "Error - " + err.message });
        } else {
          res.json(docs);
        }
      });
    } else {
      res.json({ status: 401, "status": "unauthorized" });
    }
  });
});

/* DELETE /Blog/:id */
router.delete('/:id', function(req, res, next) {
  request.get(authurl(req), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      Blog.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
    } else {
      res.json({ status: 401, "status": "unauthorized" });
    }
  });
});


var authurl = function(req) {
  var options = {
    url: configAuth.loginAuth.host + configAuth.loginAuth.port + configAuth.loginAuth.path + '/authenticate',
    headers: {
      'Authorization': req.headers.authorization
    }
  };

  return options;
};

module.exports = router;
