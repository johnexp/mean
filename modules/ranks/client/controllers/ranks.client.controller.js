(function () {
  'use strict';

  // Ranks controller
  angular
    .module('ranks')
    .controller('RanksController', RanksController);

  RanksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'rankResolve', '$translatePartialLoader', '$translate', 'RanksService'];

  function RanksController ($scope, $state, $window, Authentication, rank, $translatePartialLoader, $translate, RanksService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.rank = rank;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $translatePartialLoader.addPart('ranks');
    $translate.refresh();

    // Remove existing Rank
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.rank.$remove($state.go('ranks.list'));
      }
    }

    // Save Rank
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.rankForm');
        return false;
      }

      vm.rank.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('ranks.view', {
          rankId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
