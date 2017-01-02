(function () {
  'use strict';

  angular
    .module('ranks')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Ranks',
      state: 'ranks',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'ranks', {
      title: 'List Ranks',
      state: 'ranks.list',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'ranks', {
      title: 'Create Rank',
      state: 'ranks.create',
      roles: ['admin']
    });
  }
}());
