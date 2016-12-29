(function () {
  'use strict';

  // Mission types controller
  angular
    .module('mission-types')
    .controller('MissionTypesController', MissionTypesController);

  MissionTypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'missionTypeResolve', '$translatePartialLoader', '$translate'];

  function MissionTypesController ($scope, $state, $window, Authentication, missionType, $translatePartialLoader, $translate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.missionType = missionType;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $translatePartialLoader.addPart('mission-types');
    $translate.refresh();

    // Remove existing Mission type
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.missionType.$remove($state.go('mission-types.list'));
      }
    }

    // Save Mission type
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.missionTypeForm');
        return false;
      }

      vm.missionType.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('mission-types.view', {
          missionTypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
