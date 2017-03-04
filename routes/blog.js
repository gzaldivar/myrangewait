var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');

var mongoose = require('mongoose');
var Blog = require('../models/blog');

// Route to post a comment
router.post('/', function(req, res, next) {
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
router.get('/:id', function(req, res, next) {
  Blog.findById(req.params.id, function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

/* GET /blog */
router.get('/', function(req, res, next) {
  Blog.find(function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

/* GET /blog for Gunrange */
router.get('/search/gunrange', function(req, res, next) {
  Blog.find({ gunrange: req.query.gunrange }, function (err, docs) {
    if (err) {
      return res.status(200).send({ error: "Error - " + err.message });
    } else {
      res.json(docs);
    }
  });
});

/* DELETE /Blog/:id */
router.delete('/:id', function(req, res, next) {
  Blog.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
