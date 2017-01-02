(function () {
  'use strict';

  angular
    .module('ranks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ranks', {
        abstract: true,
        url: '/ranks',
        template: '<ui-view/>'
      })
      .state('ranks.list', {
        url: '',
        templateUrl: '/modules/ranks/client/views/list-ranks.client.view.html',
        controller: 'RanksListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Ranks List'
        }
      })
      .state('ranks.create', {
        url: '/create',
        templateUrl: '/modules/ranks/client/views/form-rank.client.view.html',
        controller: 'RanksController',
        controllerAs: 'vm',
        resolve: {
          rankResolve: newRank
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Ranks Create'
        }
      })
      .state('ranks.edit', {
        url: '/:rankId/edit',
        templateUrl: '/modules/ranks/client/views/form-rank.client.view.html',
        controller: 'RanksController',
        controllerAs: 'vm',
        resolve: {
          rankResolve: getRank
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Rank {{ rankResolve.name }}'
        }
      })
      .state('ranks.view', {
        url: '/:rankId',
        templateUrl: '/modules/ranks/client/views/view-rank.client.view.html',
        controller: 'RanksController',
        controllerAs: 'vm',
        resolve: {
          rankResolve: getRank
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Rank {{ rankResolve.name }}'
        }
      });
  }

  getRank.$inject = ['$stateParams', 'RanksService'];

  function getRank($stateParams, RanksService) {
    return RanksService.get({
      rankId: $stateParams.rankId
    }).$promise;
  }

  newRank.$inject = ['RanksService'];

  function newRank(RanksService) {
    return new RanksService();
  }
}());
