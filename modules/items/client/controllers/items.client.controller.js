(function () {
  'use strict';

  // Items controller
  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'itemResolve', '$translatePartialLoader', '$translate', 'ItemTypesService', 'RanksService'];

  function ItemsController ($scope, $state, $window, Authentication, item, $translatePartialLoader, $translate, ItemTypesService, RanksService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.item = item;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.itemTypes = ItemTypesService.query();
    vm.ranks = RanksService.query();

    $translatePartialLoader.addPart('items');
    $translate.refresh();

    // Remove existing Item
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.item.$remove($state.go('items.list'));
      }
    }

    // Save Item
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
        return false;
      }

      vm.item.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('items.view', {
          itemId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
