'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Item type Schema
 */
var ItemTypeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Item type name',
    trim: true
  },
  canBeEquiped: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  modified: [{
    _id: false,
    date: {
      type: Date
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    action: {
      type: String
    }
  }],
  active: {
    type: Boolean,
    default: true
  }
});

mongoose.model('ItemType', ItemTypeSchema);
