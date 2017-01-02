// Adventures service used to communicate Adventures REST endpoints
(function () {
  'use strict';

  angular
    .module('adventures')
    .factory('AdventuresService', AdventuresService);

  AdventuresService.$inject = ['$resource', '$log'];

  function AdventuresService($resource, $log) {
    var Adventure = $resource('/api/adventures/:adventureId', {
      adventureId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Adventure.prototype, {
      createOrUpdate: function () {
        var adventure = this;
        return createOrUpdate(adventure);
      }
    });

    return Adventure;

    function createOrUpdate(adventure) {
      if (adventure._id) {
        return adventure.$update(onSuccess, onError);
      } else {
        return adventure.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(article) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
