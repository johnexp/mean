// Ranks service used to communicate Ranks REST endpoints
(function () {
  'use strict';

  angular
    .module('ranks')
    .factory('RanksService', RanksService);

  RanksService.$inject = ['$resource', '$log', '$http'];

  function RanksService($resource, $log, $http) {
    var Rank = $resource('/api/ranks/:rankId', {
      rankId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Rank.prototype, {
      createOrUpdate: function () {
        var rank = this;
        return createOrUpdate(rank);
      }
    });

    return Rank;

    function createOrUpdate(rank) {
      if (rank._id) {
        return rank.$update(onSuccess, onError);
      } else {
        return rank.$save(onSuccess, onError);
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
