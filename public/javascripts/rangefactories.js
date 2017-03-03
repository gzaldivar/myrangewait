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

.factory('rangeResults', [ '$http', function($http) {
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

.factory('statesList', function() {
  var states = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
  ];

  var getStateList = function() {
    return states;
  }

  var getSelectedState = function(aState) {
    if (aState) {
      for (i = 0; i < states.length; i++) {
        if (aState === states[i].abbreviation) {
          return states[i];
        }
      }
    } else {
      return null;
    }
  }

  return {
    getStateList : getStateList,
    getSelectedState : getSelectedState
}
})

.factory('stallPositionFactory', function() {

  var rangestalls = function(range) {
    var stalls = [];

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

    return stalls;
  }

  return {
    rangestalls: rangestalls
  }
})
