// expose our config directly to our application using module.exports
module.exports = {

    facebookAuth : {
        clientID      : '597916630401657', // your App ID
        clientSecret  : '2bb0a5e10b7b4149799a8951144034d1', // your App Secret
        callbackURL   : 'http://localhost:8080/auth/facebook/callback'
    },

    twitterAuth : {
        consumerKey       : 'BoNwEuBz61gaoI24kRSMtQkSR',
        consumerSecret    : 'PGPhLb678lWGMChZYtzgOrhoOumJh8A3xRiCHzvRZ6F5bRLhyg',
        callbackURL       : 'http://localhost:8080/auth/twitter/callback'
    },

/*    googleAuth : {
        clientID      : 'your-secret-clientID-here',
        clientSecret  : 'your-client-secret-here',
        callbackURL   : 'http://localhost:8080/auth/google/callback'
    }
*/
    loginAuth : {
      path : '/login/auth',
      host : 'http://localhost:',
      port : 3001
    }

};
