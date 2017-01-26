(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', '$translate', '$mdSidenav'];

  function HeaderController($scope, $state, Authentication, menuService, $translate, $mdSidenav) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.sidebar = menuService.getMenu('sidebar');
    vm.changeLanguage = changeLanguage;

    vm.toggleLeftMenu = function toggleLeftMenu() {
      $mdSidenav('left').toggle();
    }

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    function changeLanguage(langKey) {
      $translate.use(langKey);
    }
  }
}());
