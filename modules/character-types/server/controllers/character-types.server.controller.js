'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CharacterType = mongoose.model('CharacterType'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Character type
 */
exports.create = function(req, res) {
  var characterType = new CharacterType(req.body);
  characterType.user = req.user;

  characterType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(characterType);
    }
  });
};

/**
 * Show the current Character type
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var characterType = req.characterType ? req.characterType.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  characterType.isCurrentUserOwner = req.user && characterType.user && characterType.user._id.toString() === req.user._id.toString();

  res.jsonp(characterType);
};

/**
 * Update a Character type
 */
exports.update = function(req, res) {
  var characterType = req.characterType;

  characterType = _.extend(characterType, req.body);

  characterType.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(characterType);
    }
  });
};

/**
 * Delete an Character type
 */
exports.delete = function(req, res) {
  var characterType = req.characterType;

  characterType.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(characterType);
    }
  });
};

/**
 * List of Character types
 */
exports.list = function(req, res) {
  CharacterType.find().sort('-created').populate('user', 'displayName').exec(function(err, characterTypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(characterTypes);
    }
  });
};

/**
 * Character type middleware
 */
exports.characterTypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Character type is invalid'
    });
  }

  CharacterType.findById(id).populate('user', 'displayName').exec(function (err, characterType) {
    if (err) {
      return next(err);
    } else if (!characterType) {
      return res.status(404).send({
        message: 'No Character type with that identifier has been found'
      });
    }
    req.characterType = characterType;
    next();
  });
};
