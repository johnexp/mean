'use strict';

/**
 * Module dependencies
 */
var characterTypesPolicy = require('../policies/character-types.server.policy'),
  characterTypes = require('../controllers/character-types.server.controller');

module.exports = function(app) {
  // Character types Routes
  app.route('/api/character-types').all(characterTypesPolicy.isAllowed)
    .get(characterTypes.list)
    .post(characterTypes.create);

  app.route('/api/character-types/:characterTypeId').all(characterTypesPolicy.isAllowed)
    .get(characterTypes.read)
    .put(characterTypes.update)
    .delete(characterTypes.delete);

  // Finish by binding the Character type middleware
  app.param('characterTypeId', characterTypes.characterTypeByID);
};
