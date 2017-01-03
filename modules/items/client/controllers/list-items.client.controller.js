(function () {
  'use strict';

  angular
    .module('items')
    .controller('ItemsListController', ItemsListController);

  ItemsListController.$inject = ['ItemsService', '$translatePartialLoader', '$translate'];

  function ItemsListController(ItemsService, $translatePartialLoader, $translate) {
    var vm = this;

    vm.items = ItemsService.query();

    $translatePartialLoader.addPart('items');
    $translate.refresh();
  }
}());
