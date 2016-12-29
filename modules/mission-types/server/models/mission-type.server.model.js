'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mission type Schema
 */
var MissionTypeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Mission type name',
    trim: true
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
    }
  }],
  active: {
    type: Boolean,
    default: true
  }
});

mongoose.model('MissionType', MissionTypeSchema);
