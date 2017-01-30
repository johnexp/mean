// Item types service used to communicate Item types REST endpoints
(function () {
  'use strict';

  angular
    .module('item-types')
    .factory('ListItemTypesService', ListItemTypesService);

  ListItemTypesService.$inject = ['$resource'];

  function ListItemTypesService($resource) {
    var ItemType = $resource('/api/item-types/:active', {
      active: '@active'
    }, {
      query: {
        method: 'GET',
        params: {
          active: '@active'
        },
        isArray: true
      }
    });

    return ItemType;
  }
}());
