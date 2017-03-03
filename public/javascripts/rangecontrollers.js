
angular.module('routerApp').controller('rangesearchController', ['$scope', '$rootScope', '$http', '$location', '$q', 'rangeResults', 'statesList', 'isLoggedInFactory',
function($scope, $rootScope, $http, $location, $q, rangeResults, statesList, isLoggedInFactory) {

//    isLoggedInFactory.getUser(function(user) {
      $scope.user = $rootScope.user;
//    })

  rangeResults.refreshSearchResults(function(results) {
    $scope.searchresults = results;

  })

  $scope.errorMessage = "Enter Search Criteria";

  $scope.numberValue = function($event){
          if(isNaN(String.fromCharCode($event.keyCode))){
              $event.preventDefault();
          }
  };

  $scope.searchbyzip = function() {
    $scope.search.state = null;
    $scope.search.name = "";
    $scope.user = $rootScope.user;

    rangeResults.removeResults;
    rangeResults.setSearchCriteria("zip", $scope.search.zip, $scope.search.distance);

    rangeResults.refreshSearchResults(function(results) {
      if (results.length > 0) {
        $scope.searchresults = results;
      } else {
        alert('No results found');
      }
    });
  };

  $scope.searchbyname = function() {
    $scope.search.state = null;
    $scope.search.zip = "";
    $scope.search.distance = "";
    $scope.user = $rootScope.user;

    rangeResults.removeResults();
    rangeResults.setSearchCriteria("name", $scope.search.name, 10);

    rangeResults.refreshSearchResults(function(results) {
      if (results.length > 0) {
        $scope.searchresults = results;
      } else {
        alert('No results found');
      }
    });
  };

  $scope.searchbystate = function(state) {
    $scope.search.name = "";
    $scope.search.zip = "";
    $scope.search.distance = "";
    $scope.user = $rootScope.user;

    rangeResults.removeResults;
    rangeResults.setSearchCriteria("state", state.abbreviation, 10);

    rangeResults.refreshSearchResults(function(results) {
      if (results.length > 0) {
        $scope.searchresults = results;
      } else {
        alert('No results found');
      }
    });
  };

  $scope.showrange = function(rangeid) {
    $scope.range = rangeResults.getResultById(rangeid);
  };

  $scope.phoneNumbr = /^\+?\d{1}[- ]?\d{3}[- ]?\d{5}$/;

  $scope.states = statesList.getStateList();
}])

.controller('addRangeController', ['$scope', '$http', '$rootScope', '$location', 'rangeResults', 'statesList', 'stallPositionFactory', function(
  $scope, $http, $rootScope, $location, rangeResults, statesList, stallPositionFactory) {

    $scope.errorMessage = "Enter range information below ......";
    $scope.states = statesList.getStateList();
    $scope.rangetypes = ['Indoor', 'Outdoor'];

    $scope.addnewrange = function() {
      if ($scope.range.name && $scope.range.addressNumber && $scope.range.street && $scope.range.city) {

        if ($scope.range.areacode && $scope.range.prefix && $scope.range.number) {
          $scope.range.phone = "(" + $scope.range.areacode + ") " + $scope.range.prefix + "-" + $scope.range.number;
        }

        $scope.range.stalls = stallPositionFactory.rangestalls($scope.range);
        $scope.range.user = $rootScope.user._id;

        $http({
          url: __env.apiUrl + "gunrange",
          method: "POST",
          data:  $scope.range
        })
        .then(function(response) {
          if (response.status == 200) {
            if (response.data.error) {
              $scope.errorMessage = response.data.error;
            } else {
              $location.url('/search');
            }
          } else {
            console.log(response);
          }
        });
      } else {
        $scope.errorMessage = "Range name, address and city are required!"
      }
    };

}])

.controller('editRangeController', ['$scope', '$rootScope', '$stateParams', '$http', '$location', 'rangeResults', 'statesList', 'stallPositionFactory',
  function($scope, $rootScope, $stateParams, $http, $location, rangeResults, statesList, stallPositionFactory) {

  $scope.errorMessage = "Update Range Information"
  var range = rangeResults.getResultById($stateParams.rangeid);

  if (range) {

    if (range.phone) {
      var phonearray = range.phone.split("-");
      range.areacode = range.phone.substring(1, 4);
      var prefixarray = phonearray[0].split(" ");
      range.prefix = prefixarray[1];
      range.number = phonearray[1];
    }

    $scope.range = range;
    $scope.selectedtype = range.rangetype;
    $scope.range.selectedState = statesList.getSelectedState(range.state);

    if (range.stalls) {
      for (i = 0; i < range.stalls.length; i++) {
        if (range.stalls[i].type === "Pistol") {
          $scope.range.pistolstalls = range.stalls[i].numberofstalls;
          $scope.range.pistolStallLength = range.stalls[i].length;
        } else if (range.stalls[i].type === "Rifle") {
          $scope.range.riflestalls = range.stalls[i].numberofstalls;
          $scope.range.rifleStallLength = range.stalls[i].length;
        } else if (range.stalls[i].type === "Shotgun") {
          $scope.range.shotgunstalls = range.stalls[i].numberofstalls;
          $scope.range.shotgunStallLength = range.stalls[i].length;
        }
      }
    }
  }

  $scope.states = statesList.getStateList();
  $scope.rangetypes = ['Indoor', 'Outdoor'];

  $scope.updateRange = function(rangeid) {
    if ($rootScope.user._id === $scope.range.user) {
      if ($scope.range.areacode && $scope.range.prefix && $scope.range.number) {
        $scope.range.phone = "(" + $scope.range.areacode + ") " + $scope.range.prefix + "-" + $scope.range.number;
      }

      $scope.range.stalls = stallPositionFactory.rangestalls($scope.range);

      $http({
        url: __env.apiUrl + "gunrange/" + rangeid,
        method: "PUT",
        data:  $scope.range
      })
      .then(function(response) {
        if (response.status == 200) {
  //          $scope.searchresults = rangeResults.addResults($scope.range);
          $location.url('/search');
        } else if (response.status == 404) {
          $scope.errorMessage = response.error;
        } else {
          console.log(response);
        }
      });
    } else {
      $scope.errorMessage = "Only the user who created the range details can update!"
    }
  };

  $scope.deleteRange = function(rangeid) {
    $http({
      url: __env.apiUrl + "gunrange/" + rangeid,
      method: "DELETE"
    })
    .then(function(response) {
      if (response.status == 200) {
        $scope.searchresults = rangeResults.removeResultById(rangeid);
      } else {
        console.log("error= " + response.status);
      }
    });
  };

}])

.controller('showRangeDetailsController', ['$scope', '$rootScope', '$stateParams', 'rangeResults',
  function($scope, $rootScope, $stateParams, rangeResults) {
    var range = rangeResults.getResultById($stateParams.rangeid);
    $scope.range = range;
}]);