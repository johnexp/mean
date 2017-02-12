(function () {
  'use strict';

  angular
    .module('item-types')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('item-types', {
        abstract: true,
        parent: 'home',
        url: 'item-types',
        template: '<ui-view/>'
      })
      .state('item-types.list', {
        url: '',
        templateUrl: '/modules/item-types/client/views/list-item-types.client.view.html',
        controller: 'ItemTypesListController',
        controllerAs: 'vm',
        resolve: {
          itemTypeResolve: newItemType
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Item types List'
        }
      })
      .state('item-types.create', {
        url: '/create',
        templateUrl: '/modules/item-types/client/views/form-item-type.client.view.html',
        controller: 'ItemTypesController',
        controllerAs: 'vm',
        resolve: {
          itemTypeResolve: newItemType
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Item types Create'
        }
      })
      .state('item-types.edit', {
        url: '/:itemTypeId/edit',
        templateUrl: '/modules/item-types/client/views/form-item-type.client.view.html',
        controller: 'ItemTypesController',
        controllerAs: 'vm',
        resolve: {
          itemTypeResolve: getItemType
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Item type {{ itemTypeResolve.name }}'
        }
      })
      .state('item-types.view', {
        url: '/:itemTypeId',
        templateUrl: '/modules/item-types/client/views/view-item-type.client.view.html',
        controller: 'ItemTypesController',
        controllerAs: 'vm',
        resolve: {
          itemTypeResolve: getItemType
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Item type {{ itemTypeResolve.name }}'
        }
      });
  }

  getItemType.$inject = ['$stateParams', 'ItemTypesService'];

  function getItemType($stateParams, ItemTypesService) {
    return ItemTypesService.get({
      itemTypeId: $stateParams.itemTypeId
    }).$promise;
  }

  newItemType.$inject = ['ItemTypesService'];

  function newItemType(ItemTypesService) {
    return new ItemTypesService();
  }
}());
