(function () {
  'use strict';

  // Item types controller
  angular
    .module('item-types')
    .controller('ItemTypesController', ItemTypesController);

  ItemTypesController.$inject = ['$scope', '$state', 'Authentication', 'itemTypeResolve', '$translatePartialLoader', '$translate', '$mdMedia', 'DialogService', 'Toast', '$log', 'PaginationService', '$timeout'];

  function ItemTypesController($scope, $state, Authentication, itemType, $translatePartialLoader, $translate, $mdMedia, DialogService, Toast, $log, PaginationService, $timeout) {
    var vm = this;

    vm.historyPagination = PaginationService.getPagination();
    vm.historyPagination.sort = '-date';
    vm.authentication = Authentication;
    vm.itemType = itemType;
    vm.itemType.vegetables = [1, 2]; // Não vai pro template
    vm.eats = getEnumValues('name');
    vm.form = {};
    vm.remove = remove;
    vm.changeState = changeState;
    vm.save = save;
    vm.$mdMedia = $mdMedia;
    vm.getEnumValues = getEnumValues;
    vm.selectedEat = [];
    vm.toggleSelectedEat = toggleSelectedEat;
    vm.vegetables = null; // Vai recebendo a query
    vm.searchTerm; // Depende de ter search
    vm.clearSearchTerm = function() { // ||
      vm.searchTerm = '';
    };
    vm.repeatCompanions = ['Teste 1', 'Teste 2'];
    vm.itemType.name = vm.itemType.name || [];

    vm.loadVegetables = function() {
      return $timeout(function() {
        vm.vegetables = vm.vegetables || [
          { _id: 1, name: 'Corn' },
          { _id: 2, name: 'Onions' },
          { _id: 3, name: 'Kale' },
          { _id: 4, name: 'Arugula' },
          { _id: 5, name: 'Peas' },
          { _id: 5, name: 'Zucchini' }
        ];
      }, 100);
    };
    vm.loadVegetables();

    angular.element(document.getElementsByClassName('select-search-searchbox')).on('keydown', function(ev) { // Depende de ter search
      ev.stopPropagation();
    });

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

    function getEnumValues(field) {
      return vm.itemType.getEnumResource().getEnumValues({
        field: field
      });
    }

    function toggleSelectedEat(fruitName) {
      var idx = vm.selectedEat.indexOf(fruitName);

      if (idx > -1) {
        vm.selectedEat.splice(idx, 1);
      } else {
        vm.selectedEat.push(fruitName);
      }
    }
  }
}());
