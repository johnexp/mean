(function () {
  'use strict';

  angular
    .module('mission-types')
    .controller('MissionTypesListController', MissionTypesListController);

  MissionTypesListController.$inject = ['MissionTypesService', '$translatePartialLoader', '$translate'];

  function MissionTypesListController(MissionTypesService, $translatePartialLoader, $translate) {
    var vm = this;

    vm.missionTypes = MissionTypesService.query();

    $translatePartialLoader.addPart('mission-types');
    $translate.refresh();
  }
}());
