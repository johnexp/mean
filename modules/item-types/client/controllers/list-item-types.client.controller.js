(function () {
  'use strict';

  angular
    .module('item-types')
    .controller('ItemTypesListController', ItemTypesListController);

  ItemTypesListController.$inject = ['itemTypeResolve', '$translatePartialLoader', '$translate', 'PaginationService', '$filter', 'Toast', 'DialogService', '$log'];

  function ItemTypesListController(itemType, $translatePartialLoader, $translate, PaginationService, $filter, Toast, DialogService, $log) {
    var vm = this;
    vm.pagination = PaginationService.getPagination();
    vm.pagination.sort = 'name';
    vm.itemTypeService = itemType;
    vm.allItemTypes = itemType.getListResource().getByState({ active: true });
    vm.itemTypes = vm.allItemTypes;
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
      vm.allItemTypes = vm.itemTypeService.getListResource().getByState({ active: vm.itemTypeFilter.active }, function () {
        vm.itemTypes = vm.allItemTypes;
        vm.itemTypeFilter = { active: vm.itemTypeFilter.active };
      });
    }

    // Change activation state of an existing Item type
    function changeState(ev, itemType) {
      DialogService.showConfirmInactivation(ev, function (option) {
        if (option === true) {
          vm.itemTypeService.$remove({ itemTypeId: itemType._id }, function () {
            filter();
          }, function (res) {
            Toast.genericErrorMessage();
            $log.error(res.data.message);
          });
        }
      });
    }

    // Remove existing Item type
    function remove(ev, itemType) {
      DialogService.showConfirmDeletion(ev, function (option) {
        if (option === true) {
          vm.itemTypeService.$remove({ itemTypeId: itemType._id }, function () {
            refilter();
          }, function (res) {
            Toast.genericErrorMessage();
            $log.error(res.data.message);
          });
        }
      });
    }

    function filter() {
      vm.itemTypeService.getListResource().query({ filter: vm.itemTypeFilter, queryCount: true }, function (result) {
        vm.pagination.queryLimit = result[0];
        PaginationService.setOffset(vm.pagination);
        vm.queryPromise = vm.itemTypeService.getListResource().query({ filter: vm.itemTypeFilter, pagination: vm.pagination }, function (result) {
          vm.itemTypes = result;
        });
      });
    }

    $translatePartialLoader.addPart('item-types');
    $translate.refresh();
  }
}());
