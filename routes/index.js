var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'My Range Wait', user: req.user });
});

module.exports = router;
