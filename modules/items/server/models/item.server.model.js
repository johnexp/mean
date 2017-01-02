'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Item name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Item description',
    trim: true
  },
  itemType: {
    type: Schema.ObjectId,
    ref: 'ItemType',
    required: "Please fill Item type"
  },
  uptime: {
    type: Number,
    min: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  canSellNPC: {
    type: Boolean,
    default: true
  },
  canSellPlayer: {
    type: Boolean,
    default: true
  },
  sellPrice: {
    type: Number,
    min: 0
  },
  buyPrice: {
    type: Number,
    min: 0
  },
  rank: {
    type: Schema.ObjectId,
    ref: 'Rank'
  },
  charMinLevel: {
    type: Number,
    min: 1
  },
  charRecomendedLevel: {
    type: Number,
    min: 1
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

mongoose.model('Item', ItemSchema);
