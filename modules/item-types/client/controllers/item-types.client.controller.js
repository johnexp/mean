(function () {
  'use strict';

  // Item types controller
  angular
    .module('item-types')
    .controller('ItemTypesController', ItemTypesController);

  ItemTypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'itemTypeResolve', '$translatePartialLoader', '$translate'];

  function ItemTypesController ($scope, $state, $window, Authentication, itemType, $translatePartialLoader, $translate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.itemType = itemType;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $translatePartialLoader.addPart('item-types');
    $translate.refresh();

    // Remove existing Item type
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.itemType.$remove($state.go('item-types.list'));
      }
    }

    // Save Item type
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemTypeForm');
        return false;
      }

      vm.itemType.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('item-types.view', {
          itemTypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
