(function () {
  'use strict';

  angular
    .module('mission-types')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Mission types',
      state: 'mission-types',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'mission-types', {
      title: 'List Mission types',
      state: 'mission-types.list',
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'mission-types', {
      title: 'Create Mission type',
      state: 'mission-types.create',
      roles: ['admin']
    });
  }
}());
