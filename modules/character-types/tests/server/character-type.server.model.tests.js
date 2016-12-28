'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CharacterType = mongoose.model('CharacterType');

/**
 * Globals
 */
var user,
  characterType;

/**
 * Unit tests
 */
describe('Character type Model Unit Tests:', function() {
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
      characterType = new CharacterType({
        name: 'Character type Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return characterType.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      characterType.name = '';

      return characterType.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    CharacterType.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
