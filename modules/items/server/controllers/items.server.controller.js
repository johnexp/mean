'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Item = mongoose.model('Item'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Item
 */
exports.create = function(req, res) {
  var item = new Item(req.body);
  item.user = req.user;
  item.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'C' });

  item.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(item);
    }
  });
};

/**
 * Show the current Item
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var item = req.item ? req.item.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  item.isCurrentUserOwner = req.user && item.user && item.user._id.toString() === req.user._id.toString();

  res.jsonp(item);
};

/**
 * Update a Item
 */
exports.update = function(req, res) {
  var item = req.item;

  item = _.extend(item, req.body);
  item.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'U' });

  item.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(item);
    }
  });
};

/**
 * Delete an Item
 */
exports.delete = function(req, res) {
  var item = req.item;

  item.active = false;
  item.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'D' });

  item.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(item);
    }
  });
};

/**
 * List of Items
 */
exports.list = function(req, res) {
  Item.find().sort('-created').populate('user', 'displayName').exec(function(err, items) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(items);
    }
  });
};

/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item is invalid'
    });
  }

  Item.findById(id).populate('user', 'displayName').populate('modified.user', 'displayName').exec(function (err, item) {
    if (err) {
      return next(err);
    } else if (!item) {
      return res.status(404).send({
        message: 'No Item with that identifier has been found'
      });
    }
    req.item = item;
    next();
  });
};

/**
 * Update item images
 */
exports.changeItemImage = function (req, res) {
  var item = req.item;
  var existingImageUrl;

  // Filtering to upload only images
  var multerConfig = config.uploads.profile.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');

  if (item) {
    existingImageUrl = item.imagePlaced;
    uploadImage()
      .then(updateItem)
      .then(deleteOldImage)
      .then(function () {
        res.json(item);
      })
      .catch(function (err) {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'Item not found'
    });
  }

  function uploadImage () {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateItem () {
    return new Promise(function (resolve, reject) {
      item.imagePlaced = config.uploads.profile.image.dest + req.file.filename;
      item.modified.push({ 'date': Date.now(), 'user': req.user, 'action': 'U' });
      item.save(function (err, theitem) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage () {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== Item.schema.path('imagePlaced').defaultValue) {
        fs.unlink(existingImageUrl, function (unlinkError) {
          if (unlinkError) {
            console.log(unlinkError);
            reject({
              message: 'Error occurred while deleting old item image'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
};

