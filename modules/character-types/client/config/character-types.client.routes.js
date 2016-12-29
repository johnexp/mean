(function () {
  'use strict';

  angular
    .module('characterTypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('character-types', {
        abstract: true,
        url: '/character-types',
        template: '<ui-view/>'
      })
      .state('character-types.list', {
        url: '',
        templateUrl: '/modules/character-types/client/views/list-character-types.client.view.html',
        controller: 'CharacterTypesListController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          pageTitle: 'Character types List'
        }
      })
      .state('character-types.create', {
        url: '/create',
        templateUrl: '/modules/character-types/client/views/form-character-type.client.view.html',
        controller: 'CharacterTypesController',
        controllerAs: 'vm',
        resolve: {
          characterTypeResolve: newCharacterType
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Character types Create'
        }
      })
      .state('character-types.edit', {
        url: '/:characterTypeId/edit',
        templateUrl: '/modules/character-types/client/views/form-character-type.client.view.html',
        controller: 'CharacterTypesController',
        controllerAs: 'vm',
        resolve: {
          characterTypeResolve: getCharacterType
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Character type {{ characterTypeResolve.name }}'
        }
      })
      .state('character-types.view', {
        url: '/:characterTypeId',
        templateUrl: '/modules/character-types/client/views/view-character-type.client.view.html',
        controller: 'CharacterTypesController',
        controllerAs: 'vm',
        resolve: {
          characterTypeResolve: getCharacterType
        },
        data: {
          roles: ['user'],
          pageTitle: 'Character type {{ characterTypeResolve.name }}'
        }
      });
  }

  getCharacterType.$inject = ['$stateParams', 'CharacterTypesService'];

  function getCharacterType($stateParams, CharacterTypesService) {
    return CharacterTypesService.get({
      characterTypeId: $stateParams.characterTypeId
    }).$promise;
  }

  newCharacterType.$inject = ['CharacterTypesService'];

  function newCharacterType(CharacterTypesService) {
    return new CharacterTypesService();
  }
}());
