(function () {
  'use strict';

  angular
    .module('item-types')
    .controller('ItemTypesListController', ItemTypesListController);

  ItemTypesListController.$inject = ['ItemTypesService', '$translatePartialLoader', '$translate'];

  function ItemTypesListController(ItemTypesService, $translatePartialLoader, $translate) {
    var vm = this;

    vm.itemTypes = ItemTypesService.query();

    $translatePartialLoader.addPart('missions');
    $translate.refresh();
  }
}());
