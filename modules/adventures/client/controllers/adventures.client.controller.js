(function () {
  'use strict';

  // Adventures controller
  angular
    .module('adventures')
    .controller('AdventuresController', AdventuresController);

  AdventuresController.$inject = ['$scope', '$state', '$window', 'Authentication', 'adventureResolve', '$translatePartialLoader', '$translate'];

  function AdventuresController ($scope, $state, $window, Authentication, adventure, $translatePartialLoader, $translate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adventure = adventure;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $translatePartialLoader.addPart('adventures');
    $translate.refresh();

    // Remove existing Adventure
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.adventure.$remove($state.go('adventures.list'));
      }
    }

    // Save Adventure
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adventureForm');
        return false;
      }

      vm.adventure.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('adventures.view', {
          adventureId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
