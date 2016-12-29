'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  MissionType = mongoose.model('MissionType');

/**
 * Globals
 */
var user,
  missionType;

/**
 * Unit tests
 */
describe('Mission type Model Unit Tests:', function() {
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
      missionType = new MissionType({
        name: 'Mission type Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return missionType.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      missionType.name = '';

      return missionType.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    MissionType.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
