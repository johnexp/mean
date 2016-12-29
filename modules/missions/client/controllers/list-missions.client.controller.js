(function () {
  'use strict';

  angular
    .module('missions')
    .controller('MissionsListController', MissionsListController);

  MissionsListController.$inject = ['MissionsService', '$translatePartialLoader', '$translate'];

  function MissionsListController(MissionsService, $translatePartialLoader, $translate) {
    var vm = this;

    vm.missions = MissionsService.query();

    $translatePartialLoader.addPart('missions');
    $translate.refresh();
  }
}());
