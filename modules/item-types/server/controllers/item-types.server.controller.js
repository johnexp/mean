'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ItemType = mongoose.model('ItemType'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Item type
 */
exports.create = function(req, res) {
  var itemType = new ItemType(req.body);
  itemType.user = req.user;
  itemType.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'C' });

  itemType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(itemType);
    }
  });
};

/**
 * Show the current Item type
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var itemType = req.itemType ? req.itemType.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  itemType.isCurrentUserOwner = req.user && itemType.user && itemType.user._id.toString() === req.user._id.toString();

  res.jsonp(itemType);
};

/**
 * Update a Item type
 */
exports.update = function(req, res) {
  var itemType = req.itemType;

  itemType = _.extend(itemType, req.body);
  itemType.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'U' });

  itemType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(itemType);
    }
  });
};

/**
 * Delete an Item type
 */
exports.delete = function(req, res) {
  var itemType = req.itemType;
  itemType.active = false;
  itemType.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'D' });

  itemType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(itemType);
    }
  });
};

/**
 * List of Item types
 */
exports.list = function(req, res) {
  ItemType.find().sort('-created').populate('user', 'displayName').exec(function(err, itemTypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(itemTypes);
    }
  });
};

/**
 * Item type middleware
 */
exports.itemTypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item type is invalid'
    });
  }

  ItemType.findById(id).populate('user', 'displayName').populate('modified.user', 'displayName').exec(function (err, itemType) {
    if (err) {
      return next(err);
    } else if (!itemType) {
      return res.status(404).send({
        message: 'No Item type with that identifier has been found'
      });
    }
    req.itemType = itemType;
    next();
  });
};
