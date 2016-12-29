'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Mission = mongoose.model('Mission'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Mission
 */
exports.create = function(req, res) {
  var mission = new Mission(req.body);
  mission.user = req.user;

  mission.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mission);
    }
  });
};

/**
 * Show the current Mission
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var mission = req.mission ? req.mission.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  mission.isCurrentUserOwner = req.user && mission.user && mission.user._id.toString() === req.user._id.toString();

  res.jsonp(mission);
};

/**
 * Update a Mission
 */
exports.update = function(req, res) {
  var mission = req.mission;

  mission = _.extend(mission, req.body);
  mission.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'U' });

  mission.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mission);
    }
  });
};

/**
 * Delete an Mission
 */
exports.delete = function(req, res) {
  var mission = req.mission;

  mission.active = false;
  mission.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'R' });

  mission.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mission);
    }
  });
};

/**
 * List of Missions
 */
exports.list = function(req, res) {
  Mission.find().sort('-created').populate('user', 'displayName').exec(function(err, missions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(missions);
    }
  });
};

/**
 * Mission middleware
 */
exports.missionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mission is invalid'
    });
  }

  Mission.findById(id).populate('user', 'displayName').exec(function (err, mission) {
    if (err) {
      return next(err);
    } else if (!mission) {
      return res.status(404).send({
        message: 'No Mission with that identifier has been found'
      });
    }
    req.mission = mission;
    next();
  });
};
