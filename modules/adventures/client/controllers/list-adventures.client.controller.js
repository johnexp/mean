(function () {
  'use strict';

  angular
    .module('adventures')
    .controller('AdventuresListController', AdventuresListController);

  AdventuresListController.$inject = ['AdventuresService', '$translatePartialLoader', '$translate'];

  function AdventuresListController(AdventuresService, $translatePartialLoader, $translate) {
    var vm = this;

    vm.adventures = AdventuresService.query();

    $translatePartialLoader.addPart('adventures');
    $translate.refresh();
  }
}());
