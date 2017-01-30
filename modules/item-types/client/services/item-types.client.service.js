// Item types service used to communicate Item types REST endpoints
(function () {
  'use strict';

  angular
    .module('item-types')
    .factory('ItemTypesService', ItemTypesService);

  ItemTypesService.$inject = ['$resource', '$log'];

  function ItemTypesService($resource, $log) {
    var ItemType = $resource('/api/item-type/:itemTypeId', {
      itemTypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(ItemType.prototype, {
      createOrUpdate: function () {
        var itemType = this;
        return createOrUpdate(itemType);
      }
    });

    return ItemType;

    function createOrUpdate(itemType) {
      if (itemType._id) {
        return itemType.$update(onSuccess, onError);
      } else {
        return itemType.$save(onSuccess, onError);
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
