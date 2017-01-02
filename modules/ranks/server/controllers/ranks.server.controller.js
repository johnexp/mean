'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rank = mongoose.model('Rank'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Rank
 */
exports.create = function(req, res) {
  var rank = new Rank(req.body);
  rank.user = req.user;
  rank.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'C' });

  rank.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rank);
    }
  });
};

/**
 * Show the current Rank
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var rank = req.rank ? req.rank.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  rank.isCurrentUserOwner = req.user && rank.user && rank.user._id.toString() === req.user._id.toString();

  res.jsonp(rank);
};

/**
 * Update a Rank
 */
exports.update = function(req, res) {
  var rank = req.rank;

  rank = _.extend(rank, req.body);
  rank.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'U' });

  rank.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rank);
    }
  });
};

/**
 * Delete an Rank
 */
exports.delete = function(req, res) {
  var rank = req.rank;

  rank.active = false;
  rank.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'D' });

  rank.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rank);
    }
  });
};

/**
 * List of Ranks
 */
exports.list = function(req, res) {
  Rank.find().sort('-created').populate('user', 'displayName').exec(function(err, ranks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ranks);
    }
  });
};

/**
 * Rank middleware
 */
exports.rankByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rank is invalid'
    });
  }

  Rank.findById(id).populate('user', 'displayName').populate('modified.user', 'displayName').exec(function (err, rank) {
    if (err) {
      return next(err);
    } else if (!rank) {
      return res.status(404).send({
        message: 'No Rank with that identifier has been found'
      });
    }
    req.rank = rank;
    next();
  });
};
