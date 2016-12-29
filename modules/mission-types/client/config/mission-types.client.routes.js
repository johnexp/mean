(function () {
  'use strict';

  angular
    .module('mission-types')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mission-types', {
        abstract: true,
        url: '/mission-types',
        template: '<ui-view/>'
      })
      .state('mission-types.list', {
        url: '',
        templateUrl: '/modules/mission-types/client/views/list-mission-types.client.view.html',
        controller: 'MissionTypesListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mission types List'
        }
      })
      .state('mission-types.create', {
        url: '/create',
        templateUrl: '/modules/mission-types/client/views/form-mission-type.client.view.html',
        controller: 'MissionTypesController',
        controllerAs: 'vm',
        resolve: {
          missionTypeResolve: newMissionType
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Mission types Create'
        }
      })
      .state('mission-types.edit', {
        url: '/:missionTypeId/edit',
        templateUrl: '/modules/mission-types/client/views/form-mission-type.client.view.html',
        controller: 'MissionTypesController',
        controllerAs: 'vm',
        resolve: {
          missionTypeResolve: getMissionType
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Mission type {{ missionTypeResolve.name }}'
        }
      })
      .state('mission-types.view', {
        url: '/:missionTypeId',
        templateUrl: '/modules/mission-types/client/views/view-mission-type.client.view.html',
        controller: 'MissionTypesController',
        controllerAs: 'vm',
        resolve: {
          missionTypeResolve: getMissionType
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mission type {{ missionTypeResolve.name }}'
        }
      });
  }

  getMissionType.$inject = ['$stateParams', 'MissionTypesService'];

  function getMissionType($stateParams, MissionTypesService) {
    return MissionTypesService.get({
      missionTypeId: $stateParams.missionTypeId
    }).$promise;
  }

  newMissionType.$inject = ['MissionTypesService'];

  function newMissionType(MissionTypesService) {
    return new MissionTypesService();
  }
}());
