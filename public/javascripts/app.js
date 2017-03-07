angular.module('routerApp', ['ui.router'])
  .run(function($rootScope, $http, $location) {
      $rootScope.loggedIn = function() {
        $http.post('/isloggedIn').success(function(data) {
          if(data.state == 'success') {
            $rootScope.authenticated = true;
            $rootScope.user = data.user;
            $rootScope.username = data.user.username;
            $location.path('/search');
          } else {
            $rootScope.authenticated = false;
            $rootScope.user = null;
            $rootScope.username = '';
            $location.path('/search');
          }
        });
      };

//      $rootScope.loggedIn();
      $rootScope.title = "My Range Wait";
  })

  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login.ejs',
        controller: 'loginController'
      })
      .state('logout', {
        url: '/logout',
        templateUrl: 'partials/home',
        controller: 'loginController'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup.ejs',
        controller: 'loginController'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'partials/home.ejs',
        controller: function($scope, $rootScope) {
                $scope.title = $rootScope.title;
            }
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile.ejs',
        controller: 'loginController'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'partials/about.ejs'
      })
      .state('search', {
        url: '/search',
        templateUrl: 'partials/search.ejs',
        controller: 'rangesearchController'
//          params: { user: {{{user}}} }
      })
      .state('addrange', {
        url: '/addrange',
        templateUrl: 'partials/addrange.ejs',
        controller: 'addRangeController'
      })
      .state('edit', {
        url: '/edit',
        templateUrl: 'partials/editrange.ejs',
        controller: 'editRangeController',
        params: { rangeid: null }
      })
      .state('showrange', {
        url: '/showrange',
        templateUrl: 'partials/showrange.ejs',
        controller: 'showRangeDetailsController',
        params: { rangeid: null }
      })
      .state('addblog', {
        url: '/addblog',
        templateUrl: 'partials/addblog.ejs',
        controller: 'addblogController',
        params: { rangeid: null }
      })
  })
