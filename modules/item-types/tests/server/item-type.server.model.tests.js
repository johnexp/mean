'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ItemType = mongoose.model('ItemType');

/**
 * Globals
 */
var user,
  itemType;

/**
 * Unit tests
 */
describe('Item type Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      itemType = new ItemType({
        name: 'Item type Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return itemType.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      itemType.name = '';

      return itemType.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    ItemType.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
