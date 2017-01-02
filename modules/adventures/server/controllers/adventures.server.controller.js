'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adventure = mongoose.model('Adventure'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adventure
 */
exports.create = function(req, res) {
  var adventure = new Adventure(req.body);
  adventure.user = req.user;
  adventure.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'C' });

  adventure.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adventure);
    }
  });
};

/**
 * Show the current Adventure
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adventure = req.adventure ? req.adventure.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adventure.isCurrentUserOwner = req.user && adventure.user && adventure.user._id.toString() === req.user._id.toString();

  res.jsonp(adventure);
};

/**
 * Update a Adventure
 */
exports.update = function(req, res) {
  var adventure = req.adventure;

  adventure = _.extend(adventure, req.body);
  adventure.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'U' });

  adventure.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adventure);
    }
  });
};

/**
 * Delete an Adventure
 */
exports.delete = function(req, res) {
  var adventure = req.adventure;

  adventure.active = false;
  adventure.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'D' });

  adventure.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adventure);
    }
  });
};

/**
 * List of Adventures
 */
exports.list = function(req, res) {
  Adventure.find().sort('-created').populate('user', 'displayName').exec(function(err, adventures) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adventures);
    }
  });
};

/**
 * Adventure middleware
 */
exports.adventureByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adventure is invalid'
    });
  }

  Adventure.findById(id).populate('user', 'displayName').populate('modified.user', 'displayName').exec(function (err, adventure) {
    if (err) {
      return next(err);
    } else if (!adventure) {
      return res.status(404).send({
        message: 'No Adventure with that identifier has been found'
      });
    }
    req.adventure = adventure;
    next();
  });
};
