'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MissionType = mongoose.model('MissionType'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Mission type
 */
exports.create = function(req, res) {
  var missionType = new MissionType(req.body);
  missionType.user = req.user;

  missionType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(missionType);
    }
  });
};

/**
 * Show the current Mission type
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var missionType = req.missionType ? req.missionType.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  missionType.isCurrentUserOwner = req.user && missionType.user && missionType.user._id.toString() === req.user._id.toString();

  res.jsonp(missionType);
};

/**
 * Update a Mission type
 */
exports.update = function(req, res) {
  var missionType = req.missionType;

  missionType = _.extend(missionType, req.body);
  missionType.modified.push({ 'date': Date.now(), 'user': req.user });

  missionType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(missionType);
    }
  });
};

/**
 * Delete an Mission type
 */
exports.delete = function(req, res) {
  var missionType = req.missionType;

  missionType.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(missionType);
    }
  });
};

/**
 * List of Mission types
 */
exports.list = function(req, res) {
  MissionType.find().sort('-created').populate('user', 'displayName').exec(function(err, missionTypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(missionTypes);
    }
  });
};

/**
 * Mission type middleware
 */
exports.missionTypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mission type is invalid'
    });
  }

  MissionType.findById(id).populate('user', 'displayName').exec(function (err, missionType) {
    if (err) {
      return next(err);
    } else if (!missionType) {
      return res.status(404).send({
        message: 'No Mission type with that identifier has been found'
      });
    }
    req.missionType = missionType;
    next();
  });
};
