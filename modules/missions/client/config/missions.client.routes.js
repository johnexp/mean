(function () {
  'use strict';

  angular
    .module('missions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('missions', {
        abstract: true,
        parent: 'home',
        url: 'missions',
        template: '<ui-view/>'
      })
      .state('missions.list', {
        url: '',
        templateUrl: '/modules/missions/client/views/list-missions.client.view.html',
        controller: 'MissionsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Missions List'
        }
      })
      .state('missions.create', {
        url: '/create',
        templateUrl: '/modules/missions/client/views/form-mission.client.view.html',
        controller: 'MissionsController',
        controllerAs: 'vm',
        resolve: {
          missionResolve: newMission
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Missions Create'
        }
      })
      .state('missions.edit', {
        url: '/:missionId/edit',
        templateUrl: '/modules/missions/client/views/form-mission.client.view.html',
        controller: 'MissionsController',
        controllerAs: 'vm',
        resolve: {
          missionResolve: getMission
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Mission {{ missionResolve.name }}'
        }
      })
      .state('missions.view', {
        url: '/:missionId',
        templateUrl: '/modules/missions/client/views/view-mission.client.view.html',
        controller: 'MissionsController',
        controllerAs: 'vm',
        resolve: {
          missionResolve: getMission
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mission {{ missionResolve.name }}'
        }
      });
  }

  getMission.$inject = ['$stateParams', 'MissionsService'];

  function getMission($stateParams, MissionsService) {
    return MissionsService.get({
      missionId: $stateParams.missionId
    }).$promise;
  }

  newMission.$inject = ['MissionsService'];

  function newMission(MissionsService) {
    return new MissionsService();
  }
}());
