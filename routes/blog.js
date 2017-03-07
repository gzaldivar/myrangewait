var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');

var mongoose = require('mongoose');
var Blog = require('../models/blog');

const expressJwt = require('express-jwt');
const jwtAuthenticate = expressJwt({secret : 'server secret'});

// Route to post a comment
router.post('/', jwtAuthenticate, function(req, res, next) {
  Blog.create(req.body, function (err, post) {
    if (err) {
      console.log(err);
      res.status(200).send({ error: "Error - " + err.message });
    } else {
      res.json(post);
    }
  });
});

/* GET /blog/id */
router.get('/:id', jwtAuthenticate, function(req, res, next) {
  Blog.findById(req.params.id, function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

/* GET /blog */
router.get('/', jwtAuthenticate, function(req, res, next) {
  Blog.find(function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

/* GET /blog for Gunrange */
router.get('/search/gunrange', jwtAuthenticate, function(req, res, next) {
  Blog.find({ gunrange: req.query.gunrange }, function (err, docs) {
    if (err) {
      return res.status(200).send({ error: "Error - " + err.message });
    } else {
      res.json(docs);
    }
  });
});

/* DELETE /Blog/:id */
router.delete('/:id', jwtAuthenticate, function(req, res, next) {
  Blog.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
