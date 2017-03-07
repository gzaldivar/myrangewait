angular.module('routerApp').controller('loginController', ['$scope', '$rootScope', '$http', '$location',
function($scope, $rootScope, $http, $location) {

  $scope.loginuser = function() {
    $http({
      url: __env.apiUrl + 'login',
      method: "POST",
      data: {
        email: $scope.email,
        password: $scope.password
      }
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
        $location.url('/home');
      }
    });
  }

  $scope.signupuser = function() {
    $http({
      url: __env.apiUrl + 'signup',
      method: "POST",
      data: {
        email: $scope.email,
        password: $scope.password
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

  $scope.logoutuser = function() {
    $rootScope.user = null;
    $rootScope.token = null;

    $http({
      url: __env.apiUrl + 'logout',
      method: "GET"
    })
    .then(function(response){
      $location.url('/home');
    });
  }

  $scope.userprofile = function() {
    $scope.username = getUsername();
    $scope.user = $rootScope.user;
  }

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
        return $rootScope.user.facebook.email;
      } else if ($rootScope.user.google) {
        return $rootScope.user.google.email;
      } else {
        return $rootScope.user.local.email;
      }
    }
  }

  $scope.title = $rootScope.title;
  $scope.username = $rootScope.username = getUsername();

  return {
    getUsername : getUsername
  }

}])
