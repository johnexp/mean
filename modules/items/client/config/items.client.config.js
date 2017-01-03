(function () {
  'use strict';

  angular
    .module('items')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Items',
      state: 'items',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'items', {
      title: 'List Items',
      state: 'items.list',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'items', {
      title: 'Create Item',
      state: 'items.create',
      roles: ['admin']
    });
  }
}());
