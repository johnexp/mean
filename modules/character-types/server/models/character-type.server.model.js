'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Character type Schema
 */
var CharacterTypeSchema = new Schema({
  name: {
    type: String,
    default: ' ',
    required: 'Please fill Character type name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: [{
    date: {
      type: Date
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  active: {
    type: Boolean,
    default: true
  }
});

mongoose.model('CharacterType', CharacterTypeSchema);
