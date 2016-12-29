// Missions service used to communicate Missions REST endpoints
(function () {
  'use strict';

  angular
    .module('missions')
    .factory('MissionsService', MissionsService);

  MissionsService.$inject = ['$resource', '$log'];

  function MissionsService($resource, $log) {
    var Mission = $resource('/api/missions/:missionId', {
      missionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Mission.prototype, {
      createOrUpdate: function () {
        var mission = this;
        return createOrUpdate(mission);
      }
    });

    return Mission;

    function createOrUpdate(mission) {
      if (mission._id) {
        return mission.$update(onSuccess, onError);
      } else {
        return mission.$save(onSuccess, onError);
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
