(function () {
  'use strict';

  angular
    .module('items')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Items',
      state: 'items',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'items', {
      title: 'List Items',
      state: 'items.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'items', {
      title: 'Create Item',
      state: 'items.create',
      roles: ['user']
    });
  }
}());
