'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Item types Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/item-types',
      permissions: '*'
    }, {
      resources: '/api/item-type/:itemTypeId',
      permissions: '*'
    }, {
      resources: '/api/item-types/:active',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/item-types',
      permissions: ['get']
    }, {
      resources: '/api/item-type/:itemTypeId',
      permissions: ['get']
    }, {
      resources: '/api/item-types/:active',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Item types Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Item type is being processed and the current user created it then allow any manipulation
  if (req.itemType && req.user && req.itemType.user && req.itemType.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
