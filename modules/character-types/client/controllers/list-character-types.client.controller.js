(function () {
  'use strict';

  angular
    .module('characterTypes')
    .controller('CharacterTypesListController', CharacterTypesListController);

  CharacterTypesListController.$inject = ['CharacterTypesService', '$translatePartialLoader', '$translate'];

  function CharacterTypesListController(CharacterTypesService, $translatePartialLoader, $translate) {
    var vm = this;

    vm.characterTypes = CharacterTypesService.query();
    $translatePartialLoader.addPart('character-types');
    $translate.refresh();
  }
}());
