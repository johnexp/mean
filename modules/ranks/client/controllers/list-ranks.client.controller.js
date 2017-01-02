(function () {
  'use strict';

  angular
    .module('ranks')
    .controller('RanksListController', RanksListController);

  RanksListController.$inject = ['RanksService', '$translatePartialLoader', '$translate'];

  function RanksListController(RanksService, $translatePartialLoader, $translate) {
    var vm = this;

    vm.ranks = RanksService.query();

    $translatePartialLoader.addPart('ranks');
    $translate.refresh();
  }
}());
