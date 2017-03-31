angular.module('routerApp', ['ui.router', 'ezfb'])
  .run(function($rootScope) {

/*      $rootScope.loggedIn = function() {
        $http.post('/isloggedIn').success(function(data) {
          if(data.state == 'success') {
            $rootScope.authenticated = true;
            $rootScope.user = data.user;

            if ($rootScope.user) {
              if ($rootScope.user.twitter) {
                $rootScope.username = $rootScope.user.twitter.username;
              } else if ($rootScope.user.facebook) {
                $rootScope.username = $rootScope.user.facebook.email;
              } else if ($rootScope.user.google) {
                $rootScope.username = $rootScope.user.google.email;
              } else if ($rootScope.user.local) {
                $rootScope.username = $rootScope.user.local.email;
              }
            }

            $location.path('/search');
          } else {
            $rootScope.authenticated = false;
            $rootScope.user = null;
            $rootScope.username = '';
            $location.path('/home');
          }
        });
      };

     $rootScope.loggedIn();
     */
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
        controller: 'loginController'
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

  .config(function(ezfbProvider) {
    ezfbProvider.setInitParams({
      // This is my FB app id for plunker demo app
      appId: '597916630401657',
    });
  })

  .config(['$httpProvider', function ($httpProvider) {
     $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
            return {
                'responseError': function(response) {
                    if (response.status === 401) {

                    } else if (response.status === 403) {
                        $location.path('/home'); // Replace with whatever should happen
                    } else if (response.status === 404) {

                    }
                    return $q.reject(response);
                }
            };
        }]);
    }])
