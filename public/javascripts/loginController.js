angular.module('routerApp').controller('loginController', ['$scope', '$rootScope', '$http', '$location', 'ezfb',
function($scope, $rootScope, $http, $location, ezfb) {

  var userlogin = function(logindata) {
    $http({
      url: __env.loginUrl + 'login/auth/login',
      method: "POST",
      data: logindata
    })
    .then(function(response){
      if (response.status == 200) {
        if (response.data.status === "success") {
          $rootScope.user = response.data.user;
          $rootScope.token = response.data.token;
          $rootScope.username = getUsername();
          $location.url('/search');
        } else {
          $rootScope.user = null;
          $rootScope.token = null;
          alert("Login Failed! Please try again.");
        }
      } else {
        $rootScope.user = null;
        $rootScope.token = null;
        $scope.username = null;
        $scope.user = null;
        $location.url('/home');
      }
    });
  };

  $scope.loginuser = function() {
    var logindata = {
      user: {
        local: {
          email: $scope.email,
          password: $scope.password
        }
      }
    }

    userlogin(logindata);
  }

  $scope.signupuser = function() {
    $http({
      url: __env.loginUrl + 'login/auth/signup',
      method: "POST",
      data: {
        user: {
          local: {
            email: $scope.email,
            password: $scope.password
          }
        }
      }
    })
    .then(function(response){
      if (response.status == 200) {
        if (response.data.status === "success") {
          $location.url('/login');
        } else {
          alert("Signup Failed! Please try again.");
        }
      } else {
        $location.url('/home');
      }
    });
  }

  $scope.fblogin = function() {
    ezfb.getLoginStatus(function(res) {
        /**
       * Calling FB.login with required permissions specified
       * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
       */
//      ezfb.login(null, {scope: 'email,user_likes'});

     ezfb.login(function (res) {
       console.log(res);
     }, {scope: 'email'})
      .then(function (res) {
        if (res.status === "connected") {
          return ezfb.api('/me');
        } else {
          alert('login failed');
        }
     })
     .then(function(me) {
       console.log(me);

        var logindata = {
          user:
            { facebook:
              { id: me.id,
                name: me.name,
                token: res.authResponse.accessToken
              }
            }
          };

        userlogin(logindata);
     });

       /* Note that the `res` result is shared.
       * Changing the `res` in 1 will also change the one in 2
       */

    });
  };

  $scope.unlink = function() {
    $http({
      url: __env.apiUrl + 'unlink/local',
      method: "GET",
      params: { user: $rootScope.user }
    })
    .then(function(response){
      if (response.status == 200) {
        if (response.data.status === "success") {
          $location.url('/profile');
        } else {
          alert(response.data.message);
        }
      } else {
        $location.url('/home');
      }
    });
  }

  $scope.link = function() {
    $http({
      url: __env.apiUrl + 'connect/local',
      method: "GET",
      params: { user: $rootScope.user }
    })
    .then(function(response){
      if (response.status == 200) {
        if (response.data.status === "success") {
          $location.url('/profile');
        } else {
          alert(response.data.message);
        }
      } else {
        $location.url('/home');
      }
    });
  }

  var getUsername = function() {
    if ($rootScope.user) {
      if ($rootScope.user.twitter) {
        return $rootScope.user.twitter.username;
      } else if ($rootScope.user.facebook) {
        return $rootScope.user.facebook.name;
      } else if ($rootScope.user.google) {
        return $rootScope.user.google.email;
      } else if ($rootScope.user.local) {
        return $rootScope.user.local.email;
      }
    }
  }

  $scope.logoutuser = function() {
    console.log($rootScope.user);

    $http({
      url: __env.loginUrl + 'login/auth/logout',
      method: "POST",
      data: { user: $rootScope.user }
    })
    .then(function(response){
      $scope.user = $rootScope.user = null;
      $scope.token = $rootScope.token = null;
      $scope.username = $rootScope.username = null;
      $location.url('/home');
    });
  }

  $scope.title = $rootScope.title;

  if ($rootScope.user) {
    $scope.user = $rootScope.user;
    $scope.username = $rootScope.username = getUsername();
  }

  return {
    getUsername : getUsername
  }

}])
