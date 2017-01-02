'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adventure Schema
 */
var AdventureSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Adventure name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Adventure description',
    trim: true
  },
  minLevel: {
    type: Number,
    min: 0,
    required: 'Please fill Adventure min level',
    default: 0
  },
  maxLevel: {
    type: Number,
    min: 1,
    required: 'Please fill Adventure max level',
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
  rewardBlood: {
    type: Number,
    min: 0
  },
  timeLimit: {
    type: Number, // of seconds,
    min: 0
  },
  canRepeat: {
    type: Boolean,
    required: 'Please fill Adventure repeat info',
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

mongoose.model('Adventure', AdventureSchema);
