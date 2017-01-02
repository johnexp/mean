'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rank Schema
 */
var RankSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Rank name',
    trim: true
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    required: 'Please fill Rank level',
    index: { unique: true }
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

mongoose.model('Rank', RankSchema);
