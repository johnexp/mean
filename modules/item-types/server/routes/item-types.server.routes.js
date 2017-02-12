'use strict';

/**
 * Module dependencies
 */
var itemTypesPolicy = require('../policies/item-types.server.policy'),
  itemTypes = require('../controllers/item-types.server.controller');

module.exports = function(app) {
  // Item types Routes
  app.route('/api/item-types').all(itemTypesPolicy.isAllowed)
    .get(itemTypes.list)
    .delete(itemTypes.changeState)
    .post(itemTypes.filter);

  app.route('/api/item-types/enum/:field').all(itemTypesPolicy.isAllowed)
    .get(itemTypes.getEnumValue);

  app.route('/api/item-types/:active').all(itemTypesPolicy.isAllowed)
    .get(itemTypes.list);

  app.route('/api/item-type/:itemTypeId').all(itemTypesPolicy.isAllowed)
    .get(itemTypes.read)
    .put(itemTypes.update)
    .delete(itemTypes.changeState);

  app.route('/api/item-type').all(itemTypesPolicy.isAllowed)
    .post(itemTypes.create);

  // Finish by binding the Item type middleware
  app.param('itemTypeId', itemTypes.itemTypeByID);
  app.param('field', itemTypes.getEnumValue);
};
