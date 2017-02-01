(function () {
  'use strict';

  angular
    .module('item-types')
    .controller('ItemTypesListController', ItemTypesListController);

  ItemTypesListController.$inject = ['ListItemTypesService', 'ItemTypesService', '$translatePartialLoader', '$translate', 'PaginationService', '$filter', 'Toast', 'DialogService'];

  function ItemTypesListController(ListItemTypesService, ItemTypesService, $translatePartialLoader, $translate, PaginationService, $filter, Toast, DialogService) {
    var vm = this;
    vm.pagination = PaginationService.getPagination();
    vm.allItemTypes = ListItemTypesService.query({ 'active': true });
    vm.itemTypes = vm.allItemTypes;
    vm.order = 'name';
    vm.filterValue = [];
    vm.itemTypeFilter = { 'active': true };

    vm.filterItems = function () {
      angular.forEach(vm.itemTypeFilter, function(value, key) {
        if (value === '') {
          delete vm.itemTypeFilter[key];
        }
      });
      vm.itemTypes = $filter('filter')(vm.allItemTypes, vm.itemTypeFilter);
    };

    vm.refilter = function() {
      vm.allItemTypes = ListItemTypesService.query(
        { 'active': vm.itemTypeFilter.active },
        function () {
          vm.itemTypes = vm.allItemTypes;
          vm.itemTypeFilter = { 'active': vm.itemTypeFilter.active };
        }
      );
    };

    vm.changeState = function (ev, itemType) {
      DialogService.showConfirmInactivation(ev, function (option) {
        if (option === true) {
          ItemTypesService.get({
            itemTypeId: itemType._id
          }).$promise.then(function (result) {
            if (result.active === true) {
              result.$remove(function () {
                itemType.active = false;
                Toast.success('Registro inativado com sucesso!');
              });
            }
          });
        }
      });
    };

    $translatePartialLoader.addPart('item-types');
    $translate.refresh();
  }
}());
