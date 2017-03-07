angular.module('routerApp').factory('isLoggedInFactory', ['$http', function($http) {
  var user;

  var getUser = function(cblk) {
    $http({
      url: __env.apiUrl + 'getUser',
      method: "GET"
    })
    .then(function(response){
      if (response.status == 200) {
        if (response.data.user) {
          user = response.data.user;
        } else {
          user = null;
        }
      } else {
        user = null;
      }
      cblk(user);
    });
  }

  return {
    getUser : getUser
  };
}])

.factory('rangeResults', [ '$http', '$rootScope', function($http, $rootScope) {
  var searchCriteria = null;
  var searchParam = null;
  var distance = 0;
  var results = [];

  var setSearchCriteria = function(value, param, zipdistance) {
    searchCriteria = value;
    searchParam = param;
    distance = zipdistance;
  }

  var clearSearchCriteria = function() {
    searhCriteria = null;
    searchParam = null;
    distance = 10;
  }

  var refreshSearchResults = function(cblk) {
    var url = "";
    var params = {};

    if (searchCriteria === "state") {
      url = __env.apiUrl + "gunrange/search/state";
      params = { state: searchParam };
    } else if (searchCriteria === "name") {
      url = __env.apiUrl + "gunrange/search/name";
      params = { name: searchParam };
    } else  if (searchCriteria ==="zip") {
      url = __env.apiUrl + "gunrange/search/getbyzip";
      params = {
        zip: searchParam,
        distance: distance
       };
    }

    if (searchCriteria != null) {
      $http({
        url: url,
        method: "GET",
        headers: { "Authorization": 'Bearer ' + $rootScope.token },
        params: params
      })
      .then(function(response){
        if (response.status == 200) {
          results = response.data;
          cblk(results);
        } else {
          cblk(results);
        }
      });
    }
  }

  var addResults = function(newResults) {
    results = newResults;
    return results;
  };

  var getResults = function() {
    return results;
  };

  var removeResults = function() {
    results = [];
  }

  var getResultById = function(id) {
    for (i = 0; i < results.length; i++) {
      if (id === results[i]._id) {
        return results[i];
      }
    }
  }

  var removeResultById = function(id) {
    for (var i =0; i < results.length; i++)
       if (results[i]._id === id) {
          results.splice(i,1);
          return results;
       }
  }

  return {
    addResults: addResults,
    getResults: getResults,
    removeResults: removeResults,
    getResultById : getResultById,
    removeResultById : removeResultById,
    clearSearchCriteria : clearSearchCriteria,
    refreshSearchResults : refreshSearchResults,
    setSearchCriteria : setSearchCriteria
  };
}])

.factory('stallPositionFactory', function() {

  var rangestalls = function(range) {
    var stalls = [];

    if (range.allstalls) {
      var entry = {
        type: "All",
        numberofstalls: range.allstalls,
        length: range.allStallLength
      }
      stalls.push(entry);

    } else {
      if (range.pistolstalls) {
        var entry = {
          type: "Pistol",
          numberofstalls: range.pistolstalls,
          length: range.pistolStallLength
        }
        stalls.push(entry);
      }

      if (range.riflestalls) {
        var entry = {
          type: "Rifle",
          numberofstalls: range.riflestalls,
          length: range.rifleStallLength
        }
        stalls.push(entry);
      }

      if (range.shotgunstalls) {
        var entry = {
          type: "Shotgun",
          numberofstalls: range.shotgunstalls,
          length: range.shotgunStallLength
        }
        stalls.push(entry);
      }
    }

    return stalls;
  }

  return {
    rangestalls: rangestalls
  }
})
