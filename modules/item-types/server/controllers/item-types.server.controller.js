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

  itemType.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(itemType);
    }
  });
};

/**
 * Change activation state of an Item type
 */
exports.changeState = function(req, res) {
  var itemType = req.itemType;
  itemType.active = !itemType.active;
  var state = itemType.active ? 'A' : 'I';
  itemType.modified.push({ 'date': Date.now(), 'user': req.user, 'action': state });

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
  var objFilter = {};
  if (req.params.hasOwnProperty('active')) {
    objFilter.active = req.params.active;
  }

  ItemType.find(objFilter).sort('-created').populate('user', 'displayName').exec(function(err, itemTypes) {
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
 * Filter Item types
 */
exports.filter = function(req, res) {
  if (req.body.hasOwnProperty('queryCount') && req.body.queryCount === true) {
    return count(req.body, res);
  }
  var filter = req.body.hasOwnProperty('filter') ? req.body.filter : {};
  var paramsLength = Object.keys(filter).length;
  var pagination = req.body.hasOwnProperty('pagination') ? req.body.pagination : { sort: '', offset: 0, limit: 10 };
  for (var i = 0; i < paramsLength; i++) {
    var key = Object.keys(filter)[i];
    if (typeof filter[key] === 'string' || filter[key] instanceof String) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  ItemType.find(filter).sort(pagination.sort).skip(pagination.offset).limit(pagination.limit).populate('user', 'displayName').exec(function(err, itemTypes) {
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
 * Filter Item types
 */
function count(body, res) {
  var filter = body.hasOwnProperty('filter') ? body.filter : {};
  var paramsLength = Object.keys(filter).length;
  for (var i = 0; i < paramsLength; i++) {
    var key = Object.keys(filter)[i];
    if (typeof filter[key] === 'string' || filter[key] instanceof String) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  ItemType.count(filter).exec(function(err, count) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp([count]);
    }
  });
}

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

exports.getEnumValue = function(req, res, next, field) {
  try {
    var enumValues = ItemType.schema.path(field).enumValues;
    res.jsonp(enumValues);
  } catch (ex) {
    return res.status(400).send({
      message: 'The field "' + field + '" is not a valid enum.'
    });
  }
};
