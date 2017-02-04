(function () {
  'use strict';

  angular
    .module('item-types')
    .controller('ItemTypesListController', ItemTypesListController);

  ItemTypesListController.$inject = ['ListItemTypesService', 'ItemTypesService', '$translatePartialLoader', '$translate', 'PaginationService', '$filter', 'Toast', 'DialogService', '$log'];

  function ItemTypesListController(ListItemTypesService, ItemTypesService, $translatePartialLoader, $translate, PaginationService, $filter, Toast, DialogService, $log) {
    var vm = this;
    vm.pagination = PaginationService.getPagination();
    vm.pagination.sort = 'name';
    vm.allItemTypes = ListItemTypesService.getByState({ active: true });
    vm.itemTypes = vm.allItemTypes;
    vm.filterValue = [];
    vm.itemTypeFilter = { active: true };
    vm.filterItems = filterItems;
    vm.refilter = refilter;
    vm.changeState = changeState;
    vm.remove = remove;
    vm.filter = filter;

    function filterItems() {
      angular.forEach(vm.itemTypeFilter, function (value, key) {
        if (value === '') {
          delete vm.itemTypeFilter[key];
        }
      });
      vm.itemTypes = $filter('filter')(vm.allItemTypes, vm.itemTypeFilter);
    }

    function refilter() {
      vm.allItemTypes = ListItemTypesService.getByState({ active: vm.itemTypeFilter.active }, function () {
        vm.itemTypes = vm.allItemTypes;
        vm.itemTypeFilter = { active: vm.itemTypeFilter.active };
      });
    }

    // Change activation state of an existing Item type
    function changeState(ev, itemType) {
      DialogService.showConfirmInactivation(ev, function (option) {
        if (option === true) {
          var ItemTypeResource = new ItemTypesService();
          ItemTypeResource.$remove({ itemTypeId: itemType._id }, function () {
            filter();
          }, function (res) {
            Toast.error($translate.instant('Your request could not be completed! Please contact your system administrator.'));
            $log.error(res.data.message);
          });
        }
      });
    }

    // Remove existing Item type
    function remove(ev, itemType) {
      DialogService.showConfirmDeletion(ev, function (option) {
        if (option === true) {
          var ItemTypeResource = new ItemTypesService();
          ItemTypeResource.$remove({ itemTypeId: itemType._id }, function () {
            refilter();
          }, function (res) {
            Toast.error($translate.instant('Your request could not be completed! Please contact your system administrator.'));
            $log.error(res.data.message);
          });
        }
      });
    }

    function filter() {
      ListItemTypesService.query({ filter: vm.itemTypeFilter, queryCount: true }, function (result) {
        vm.pagination.queryLimit = result[0];
        PaginationService.setOffset(vm.pagination);
        vm.queryPromise = ListItemTypesService.query({ filter: vm.itemTypeFilter, pagination: vm.pagination }, function (result) {
          vm.itemTypes = result;
        });
      });
    }

    $translatePartialLoader.addPart('item-types');
    $translate.refresh();
  }
}());
