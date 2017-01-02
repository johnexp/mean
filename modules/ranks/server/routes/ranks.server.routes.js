'use strict';

/**
 * Module dependencies
 */
var ranksPolicy = require('../policies/ranks.server.policy'),
  ranks = require('../controllers/ranks.server.controller');

module.exports = function(app) {
  // Ranks Routes
  app.route('/api/ranks').all(ranksPolicy.isAllowed)
    .get(ranks.list)
    .post(ranks.create);

  app.route('/api/ranks/:rankId').all(ranksPolicy.isAllowed)
    .get(ranks.read)
    .put(ranks.update)
    .delete(ranks.delete);

  // Finish by binding the Rank middleware
  app.param('rankId', ranks.rankByID);
};
