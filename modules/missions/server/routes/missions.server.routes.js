'use strict';

/**
 * Module dependencies
 */
var missionsPolicy = require('../policies/missions.server.policy'),
  missions = require('../controllers/missions.server.controller');

module.exports = function(app) {
  // Missions Routes
  app.route('/api/missions').all(missionsPolicy.isAllowed)
    .get(missions.list)
    .post(missions.create);

  app.route('/api/missions/:missionId').all(missionsPolicy.isAllowed)
    .get(missions.read)
    .put(missions.update)
    .delete(missions.delete);

  // Finish by binding the Mission middleware
  app.param('missionId', missions.missionByID);
};
