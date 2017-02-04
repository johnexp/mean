// Item types service used to communicate Item types REST endpoints
(function () {
  'use strict';

  angular
    .module('item-types')
    .factory('ListItemTypesService', ListItemTypesService);

  ListItemTypesService.$inject = ['$resource'];

  function ListItemTypesService($resource) {
    var ItemType = $resource('/api/item-types/:active', {}, {
      getByState: {
        method: 'GET',
        params: {
          active: '@active'
        },
        isArray: true
      },
      query: {
        method: 'POST',
        transformRequest: function (data) {
          return JSON.stringify(data);
        },
        isArray: true
      },
      delete: {
        method: 'DELETE',
        transformRequest: function (data) {
          return JSON.stringify(data);
        },
        isArray: true
      }
    });

    return ItemType;
  }
}());
