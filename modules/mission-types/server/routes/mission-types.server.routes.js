'use strict';

/**
 * Module dependencies
 */
var missionTypesPolicy = require('../policies/mission-types.server.policy'),
  missionTypes = require('../controllers/mission-types.server.controller');

module.exports = function(app) {
  // Mission types Routes
  app.route('/api/mission-types').all(missionTypesPolicy.isAllowed)
    .get(missionTypes.list)
    .post(missionTypes.create);

  app.route('/api/mission-types/:missionTypeId').all(missionTypesPolicy.isAllowed)
    .get(missionTypes.read)
    .put(missionTypes.update)
    .delete(missionTypes.delete);

  // Finish by binding the Mission type middleware
  app.param('missionTypeId', missionTypes.missionTypeByID);
};
