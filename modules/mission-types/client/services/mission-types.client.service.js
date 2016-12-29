// Mission types service used to communicate Mission types REST endpoints
(function () {
  'use strict';

  angular
    .module('mission-types')
    .factory('MissionTypesService', MissionTypesService);

  MissionTypesService.$inject = ['$resource', '$log'];

  function MissionTypesService($resource, $log) {
    var MissionType = $resource('/api/mission-types/:missionTypeId', {
      missionTypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(MissionType.prototype, {
      createOrUpdate: function () {
        var missionType = this;
        return createOrUpdate(missionType);
      }
    });

    return MissionType;

    function createOrUpdate(missionType) {
      if (missionType._id) {
        return missionType.$update(onSuccess, onError);
      } else {
        return missionType.$save(onSuccess, onError);
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
