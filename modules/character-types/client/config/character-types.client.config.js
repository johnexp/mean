(function () {
  'use strict';

  angular
    .module('characterTypes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Character types',
      state: 'character-types',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'character-types', {
      title: 'List Character types',
      state: 'character-types.list',
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'character-types', {
      title: 'Create Character type',
      state: 'character-types.create',
      roles: ['admin']
    });
  }
}());
