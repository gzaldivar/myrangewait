var jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const jwtAuthenticate = expressJwt({secret : 'server secret'});

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
//    app.get('/', function(req, res) {
//        res.render('index.ejs'); // load the index.ejs file
//
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          res.status(200).json({ status: "failed" });
        } else {

          //user has authenticated correctly thus we create a JWT token
          var token = jwt.sign({
              id: user._id,
            }, 'server secret', {
              expiresIn : 60*60*24
            });

          res.json({ status: "success", token: token, user: user });
        }

      })(req, res, next);
    });
//    {
//        successRedirect : '/rangemenu', // redirect to the secure profile section
//        failureRedirect : '/login', // redirect back to the signup page if there is an error
//        failureFlash : true // allow flash messages
//    }
//  ));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          res.status(200).json({ status: "failed" });
        } else {
          res.json({ status: "success", user: user });
        }

      })(req, res, next);
    });
//    {
//        successRedirect : '/rangemenu', // redirect to the secure profile section
//        failureRedirect : '/signup', // redirect back to the signup page if there is an error
//        failureFlash : true // allow flash messages
//    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
      console.log(req.user);
        res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            title: 'My Range Wait'
        });
    });

    // =====================================
    // RANGEMENU SECTION =====================
    // =====================================
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/rangemenu', function(req, res) {
        res.render('rangemenu.ejs', {
            user : req.user, // get the user out of session and pass to template
            title: 'My Range Wait'
        });
    });

    // =====================================
    // RANGEMENU SECTION =====================
    // =====================================
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/about', function(req, res) {
        res.render('about.ejs', {
            title: 'My Range Wait',
            user: req.user
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/rangemenu',
            failureRedirect : '/'
    }));

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/rangemenu',
            failureRedirect : '/'
        }));

        // =============================================================================
        // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
        // =============================================================================

// locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

// facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', function(req, res) {
      var user = req.user;
      user.local.email = undefined;
      user.local.password = undefined;
      user.save(function(err) {
        if (err) {
          res.json({ status: "error", message: "Error unlinking user" });
        } else {
          res.json({ status: "success", message: "User linked!" });
        }
      });
  });

  // facebook -------------------------------
  app.get('/unlink/facebook', function(req, res) {
      var user = req.user;
      console.log(user);
      user.facebook.token = undefined;
      user.save(function(err) {
          res.redirect('/profile');
      });
  });

  // twitter --------------------------------
  app.get('/unlink/twitter', function(req, res) {
      var user = req.user;
      user.twitter.token = undefined;
      user.save(function(err) {
         res.redirect('/profile');
      });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
      req.logout();
//      res.redirect('/');
  });

  app.post('/isLoggedin', function(req,res) {
    if (req.isAuthenticated()) {
      return res.status(200).send({state: 'success',  user: req.user });
    } else {
      return res.status(200).send({state: 'failure', user: null });
    }
  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
