(function () {
  'use strict';

  // Character types controller
  angular
    .module('characterTypes')
    .controller('CharacterTypesController', CharacterTypesController);

  CharacterTypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'characterTypeResolve', '$translatePartialLoader', '$translate'];

  function CharacterTypesController ($scope, $state, $window, Authentication, characterType, $translatePartialLoader, $translate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.characterType = characterType;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $translatePartialLoader.addPart('character-types');
    $translate.refresh();

    // Remove existing Character type
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.characterType.$remove($state.go('character-types.list'));
      }
    }

    // Save Character type
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.characterTypeForm');
        return false;
      }

      vm.characterType.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('character-types.view', {
          characterTypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
