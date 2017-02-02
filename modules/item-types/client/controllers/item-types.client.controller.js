(function () {
  'use strict';

  // Item types controller
  angular
    .module('item-types')
    .controller('ItemTypesController', ItemTypesController);

  ItemTypesController.$inject = ['$scope', '$state', 'Authentication', 'itemTypeResolve', '$translatePartialLoader', '$translate', '$mdMedia', 'DialogService', 'Toast'];

  function ItemTypesController($scope, $state, Authentication, itemType, $translatePartialLoader, $translate, $mdMedia, DialogService, Toast) {
    var vm = this;

    vm.authentication = Authentication;
    vm.itemType = itemType;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.changeState = changeState;
    vm.save = save;
    vm.$mdMedia = $mdMedia;

    $translatePartialLoader.addPart('item-types');
    $translate.refresh();

    // Remove existing Item type
    function remove(ev) {
      DialogService.showConfirmDeletion(ev, function (option) {
        if (option === true) {
          vm.itemType.$remove(function () {
            $state.go('item-types.list');
            Toast.success($translate.instant('Item successfully deleted!'));
          });
        }
      });
    }

    // Change activation state of an existing Item type
    function changeState(ev) {
      DialogService.showConfirmInactivation(ev, function (option) {
        if (option === true) {
          vm.itemType.$remove(function () {
            vm.itemType.active = false;
            Toast.success($translate.instant('Item successfully inactivated!'));
          });
        }
      });
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
