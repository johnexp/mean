(function () {
  'use strict';

  angular
    .module('item-types')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Item types',
      state: 'item-types',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'item-types', {
      title: 'List Item types',
      state: 'item-types.list',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'item-types', {
      title: 'Create Item type',
      state: 'item-types.create',
      roles: ['admin']
    });
  }
}());
