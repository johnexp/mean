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
    required: 'Please fill Item type'
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
    min: 1,
    required: 'Please fill character min level',
    default: 1
  },
  charRecomendedLevel: {
    type: Number,
    min: 1
  },
  sellCurrency: {
    type: String,
    required: 'Please fill item sell currency',
    default: 'feather'
  },
  buyCurrency: {
    type: String,
    required: 'Please fill item buy currency',
    default: 'feather'
  },
  hardness: {
    type: Number,
    min: 0
  },
  maxHealth: {
    type: Number,
    min: 1
  },
  maxItemLevel: {
    type: Number,
    min: 1,
    default: 1
  },
  incrementPerLevel: {
    type: Number,
    min: 0,
    default: 0
  },
  thumbnail: {
    type: Buffer,
    required: 'Please fill item thumbnail'
  },
  imagePlaced: {
    type: Buffer,
    required: 'Please fill item placed image'
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

// Getter
ItemSchema.path('hardness').get(function(num) {
  return (num / 100).toFixed(2);
});

// Setter
ItemSchema.path('hardness').set(function(num) {
  return num * 100;
});

mongoose.model('Item', ItemSchema);
