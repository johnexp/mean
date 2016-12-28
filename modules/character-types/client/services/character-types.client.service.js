// Character types service used to communicate Character types REST endpoints
(function () {
  'use strict';

  angular
    .module('characterTypes.services')
    .factory('CharacterTypesService', CharacterTypesService);

  CharacterTypesService.$inject = ['$resource', '$log'];

  function CharacterTypesService($resource, $log) {
    var CharacterType = $resource('/api/character-types/:characterTypeId', {
      characterTypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(CharacterType.prototype, {
      createOrUpdate: function () {
        var characterType = this;
        return createOrUpdate(characterType);
      }
    });

    return CharacterType;

    function createOrUpdate(characterType) {
      if (characterType._id) {
        return characterType.$update(onSuccess, onError);
      } else {
        return characterType.$save(onSuccess, onError);
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
