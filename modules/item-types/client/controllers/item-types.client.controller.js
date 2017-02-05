(function () {
  'use strict';

  // Item types controller
  angular
    .module('item-types')
    .controller('ItemTypesController', ItemTypesController);

  ItemTypesController.$inject = ['$scope', '$state', 'Authentication', 'itemTypeResolve', '$translatePartialLoader', '$translate', '$mdMedia', 'DialogService', 'Toast', '$log'];

  function ItemTypesController($scope, $state, Authentication, itemType, $translatePartialLoader, $translate, $mdMedia, DialogService, Toast, $log) {
    var vm = this;

    vm.authentication = Authentication;
    vm.itemType = itemType;
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
          }, function (res) {
            Toast.genericErrorMessage();
            $log.error(res.data.message);
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
          }, function (res) {
            Toast.genericErrorMessage();
            $log.error(res.data.message);
          });
        }
      });
    }

    // Save Item type
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemTypeForm');
        Toast.error($translate.instant('Some fields were not filled correctly'));
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
        Toast.genericErrorMessage();
        $log.error(res.data.message);
      }
    }
  }
}());
