'use strict';

/**
 * Module dependencies
 */
var adventuresPolicy = require('../policies/adventures.server.policy'),
  adventures = require('../controllers/adventures.server.controller');

module.exports = function(app) {
  // Adventures Routes
  app.route('/api/adventures').all(adventuresPolicy.isAllowed)
    .get(adventures.list)
    .post(adventures.create);

  app.route('/api/adventures/:adventureId').all(adventuresPolicy.isAllowed)
    .get(adventures.read)
    .put(adventures.update)
    .delete(adventures.delete);

  // Finish by binding the Adventure middleware
  app.param('adventureId', adventures.adventureByID);
};
