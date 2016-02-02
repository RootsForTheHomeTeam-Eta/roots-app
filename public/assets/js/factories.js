// Authentication service
rootsApp.factory('AuthService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {

  // create user variable
  var user = {};

  // return available functions for use in controllers
  return ({
    isLoggedIn: isLoggedIn,
    getUserStatus: getUserStatus,
    login: login,
    logout: logout,
    register: register,
    isAdmin: isAdmin,
    user: user
  });

  function isAdmin() {
    if (user.isAdmin) {
      return true;
    } else {
      return false;
    }
  }

  function isLoggedIn() {
    if (user.loggedIn) {
      return true;
    } else {
      return false;
    }
  }

  function getUserStatus() {
    return user;
  }

  function login(username, password) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/auth/login', {username: username, password: password})
      // handle success
      .success(function (data, status) {
        if(status === 200 && data.status) {
          console.log('data',data)
          user.loggedIn = true;
          user.isAdmin = data.isAdmin;
          user.orgName = data.orgName;
          console.log('user in auth service',user);
          deferred.resolve();
        } else {
          user = false;
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        user.loggedIn = false;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;
  }

  function logout() {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a get request to the server
    $http.get('/api/auth/logout')
      // handle success
      .success(function (data) {
        user.loggedIn = false;
        deferred.resolve();
      })
      // handle error
      .error(function (data) {
        user.loggedIn = false;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;
  }

  function register(username, password) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/auth/register', {username: username, password: password})
      // handle success
      .success(function (data, status) {
        if(status === 200 && data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }
}]);
// creates a service that shares the venue object between controllers
rootsApp.factory('SharedVenues', function() {
  var venues = [];

  return {
    // returns the venues variable
    getVenues: function() {
      return venues;
    },
    // sets venues variable.  value should only ever be an object
    setVenues: function(value) {
      if (typeof value === 'object' && value !== null) {
        venues = value;
      } else {
        throw new Error('setVenues() requires an array of objects');
      }
    }
  };
});

/**
 * Created by Manu on 1/29/16.
 */
rootsApp.factory('messages', function() {

    var messages = {};

    //this is hardcoded- would need dynamic values
    messages.list = [{id: 'Urban Roots Farm'}, {id: 'Youth Farm Lyndale'}, {id: 'Dream of Wild Health'}];

    messages.add = function(message){
        // get request pulls orgnames from submitted forms
        //push orgnames from organizations that have submitted forms into
        messages.list.push({id: user.orgName});
    };

    return messages;

    console.log(messages);
    console.log(messages.list);
});
//creates a service that shares the user object between controllers
rootsApp.factory('UserRepoFactory', function($http){
    var contactEmails = function(){
        return $http
            // /api/user/getUsers to return orgNames and emails
            .get('/api/user/getUsers')
            .then(function(response){
                return response.data;
            }, function(err) {
                return err;
            });
    };

    return {
        get: contactEmails
    };
});


// creates a service that shares the venue object between controllers
rootsApp.factory('VenueEventsFactory', function($http) {

    var venues = {};

    return{
        getVenues : function() {
            return  $http({
                url: '/api/event/getEvents',
                method: 'GET'
            }).success(function(result){
                    venues.data = result;
                    console.log('venues.data',venues.data);

                })
                .error(function(data, status, headers, config) {
                    $log.warn(data, status, headers(), config);
                });
        },
        venues: venues
    };
});