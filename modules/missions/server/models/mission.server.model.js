'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mission Schema
 */
var MissionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Mission name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Mission description',
    trim: true
  },
  missionType: {
    type: Schema.ObjectId,
    ref: 'MissionType',
    required: 'Please fill Mission type'
  },
  minLevel: {
    type: Number,
    min: 0,
    required: 'Please fill Mission min level',
    default: 0
  },
  maxLevel: {
    type: Number,
    min: 1,
    required: 'Please fill Mission max level',
    default: 100
  },
  rewardFeather: {
    type: Number,
    min: 0
  },
  rewardXp: {
    type: Number,
    min: 0
  },
  timeLimit: {
    type: Number, // of seconds,
    min: 0
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

mongoose.model('Mission', MissionSchema);
