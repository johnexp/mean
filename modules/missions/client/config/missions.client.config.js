(function () {
  'use strict';

  angular
    .module('missions')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Missions',
      state: 'missions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'missions', {
      title: 'List Missions',
      state: 'missions.list',
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'missions', {
      title: 'Create Mission',
      state: 'missions.create',
      roles: ['user', 'admin']
    });
  }
}());
