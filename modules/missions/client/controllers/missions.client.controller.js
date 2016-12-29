(function () {
  'use strict';

  // Missions controller
  angular
    .module('missions')
    .controller('MissionsController', MissionsController);

  MissionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'missionResolve', '$translatePartialLoader', '$translate', 'MissionTypesService'];

  function MissionsController ($scope, $state, $window, Authentication, mission, $translatePartialLoader, $translate, MissionTypesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.mission = mission;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.missionTypes = MissionTypesService.query();

    $translatePartialLoader.addPart('missions');
    $translate.refresh();

    // Remove existing Mission
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.mission.$remove($state.go('missions.list'));
      }
    }

    // Save Mission
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.missionForm');
        return false;
      }

      vm.mission.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('missions.view', {
          missionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
