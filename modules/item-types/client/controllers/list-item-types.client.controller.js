(function () {
  'use strict';

  angular
    .module('item-types')
    .controller('ItemTypesListController', ItemTypesListController);

  ItemTypesListController.$inject = ['ListItemTypesService', '$translatePartialLoader', '$translate', 'PaginationService', '$filter'];

  function ItemTypesListController(ListItemTypesService, $translatePartialLoader, $translate, PaginationService, $filter) {
    var vm = this;
    vm.pagination = PaginationService.getPagination();
    vm.allItemTypes = ListItemTypesService.query({ 'active': true });
    vm.itemTypes = vm.allItemTypes;
    vm.order = 'name';
    vm.filterValue = [];
    vm.itemTypeFilter = { 'active': true };

    vm.filterItems = function () {
      vm.itemTypes = $filter('filter')(vm.allItemTypes, vm.itemTypeFilter);
    };

    vm.refilter = function() {
      vm.allItemTypes = ListItemTypesService.query({ 'active': vm.itemTypeFilter.active });
      vm.itemTypes = vm.allItemTypes;
    };

    $translatePartialLoader.addPart('item-types');
    $translate.refresh();
  }
}());
