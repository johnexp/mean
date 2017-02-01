(function () {
  'use strict';

  angular
    .module('adventures')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('adventures', {
        abstract: true,
        parent: 'home',
        url: '/adventures',
        template: '<ui-view/>'
      })
      .state('adventures.list', {
        url: '',
        templateUrl: '/modules/adventures/client/views/list-adventures.client.view.html',
        controller: 'AdventuresListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Adventures List'
        }
      })
      .state('adventures.create', {
        url: '/create',
        templateUrl: '/modules/adventures/client/views/form-adventure.client.view.html',
        controller: 'AdventuresController',
        controllerAs: 'vm',
        resolve: {
          adventureResolve: newAdventure
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Adventures Create'
        }
      })
      .state('adventures.edit', {
        url: '/:adventureId/edit',
        templateUrl: '/modules/adventures/client/views/form-adventure.client.view.html',
        controller: 'AdventuresController',
        controllerAs: 'vm',
        resolve: {
          adventureResolve: getAdventure
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Adventure {{ adventureResolve.name }}'
        }
      })
      .state('adventures.view', {
        url: '/:adventureId',
        templateUrl: '/modules/adventures/client/views/view-adventure.client.view.html',
        controller: 'AdventuresController',
        controllerAs: 'vm',
        resolve: {
          adventureResolve: getAdventure
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Adventure {{ adventureResolve.name }}'
        }
      });
  }

  getAdventure.$inject = ['$stateParams', 'AdventuresService'];

  function getAdventure($stateParams, AdventuresService) {
    return AdventuresService.get({
      adventureId: $stateParams.adventureId
    }).$promise;
  }

  newAdventure.$inject = ['AdventuresService'];

  function newAdventure(AdventuresService) {
    return new AdventuresService();
  }
}());
