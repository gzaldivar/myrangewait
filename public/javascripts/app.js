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

      $rootScope.loggedIn();
  })

  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/search');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'partials/rangemenuoptions.ejs'
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
  })
