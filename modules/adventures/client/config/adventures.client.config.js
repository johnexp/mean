(function () {
  'use strict';

  angular
    .module('adventures')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Adventures',
      state: 'adventures',
      type: 'dropdown',
      icon: 'nature_people',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'adventures', {
      title: 'List Adventures',
      state: 'adventures.list',
      roles: ['user', 'admin']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'adventures', {
      title: 'Create Adventure',
      state: 'adventures.create',
      roles: ['admin']
    });
  }
}());
