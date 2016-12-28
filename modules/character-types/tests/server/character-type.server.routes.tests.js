'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CharacterType = mongoose.model('CharacterType'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  characterType;

/**
 * Character type routes tests
 */
describe('Character type CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Character type
    user.save(function () {
      characterType = {
        name: 'Character type name'
      };

      done();
    });
  });

  it('should be able to save a Character type if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Character type
        agent.post('/api/characterTypes')
          .send(characterType)
          .expect(200)
          .end(function (characterTypeSaveErr, characterTypeSaveRes) {
            // Handle Character type save error
            if (characterTypeSaveErr) {
              return done(characterTypeSaveErr);
            }

            // Get a list of Character types
            agent.get('/api/characterTypes')
              .end(function (characterTypesGetErr, characterTypesGetRes) {
                // Handle Character types save error
                if (characterTypesGetErr) {
                  return done(characterTypesGetErr);
                }

                // Get Character types list
                var characterTypes = characterTypesGetRes.body;

                // Set assertions
                (characterTypes[0].user._id).should.equal(userId);
                (characterTypes[0].name).should.match('Character type name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Character type if not logged in', function (done) {
    agent.post('/api/characterTypes')
      .send(characterType)
      .expect(403)
      .end(function (characterTypeSaveErr, characterTypeSaveRes) {
        // Call the assertion callback
        done(characterTypeSaveErr);
      });
  });

  it('should not be able to save an Character type if no name is provided', function (done) {
    // Invalidate name field
    characterType.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Character type
        agent.post('/api/characterTypes')
          .send(characterType)
          .expect(400)
          .end(function (characterTypeSaveErr, characterTypeSaveRes) {
            // Set message assertion
            (characterTypeSaveRes.body.message).should.match('Please fill Character type name');

            // Handle Character type save error
            done(characterTypeSaveErr);
          });
      });
  });

  it('should be able to update an Character type if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Character type
        agent.post('/api/characterTypes')
          .send(characterType)
          .expect(200)
          .end(function (characterTypeSaveErr, characterTypeSaveRes) {
            // Handle Character type save error
            if (characterTypeSaveErr) {
              return done(characterTypeSaveErr);
            }

            // Update Character type name
            characterType.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Character type
            agent.put('/api/characterTypes/' + characterTypeSaveRes.body._id)
              .send(characterType)
              .expect(200)
              .end(function (characterTypeUpdateErr, characterTypeUpdateRes) {
                // Handle Character type update error
                if (characterTypeUpdateErr) {
                  return done(characterTypeUpdateErr);
                }

                // Set assertions
                (characterTypeUpdateRes.body._id).should.equal(characterTypeSaveRes.body._id);
                (characterTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Character types if not signed in', function (done) {
    // Create new Character type model instance
    var characterTypeObj = new CharacterType(characterType);

    // Save the characterType
    characterTypeObj.save(function () {
      // Request Character types
      request(app).get('/api/characterTypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Character type if not signed in', function (done) {
    // Create new Character type model instance
    var characterTypeObj = new CharacterType(characterType);

    // Save the Character type
    characterTypeObj.save(function () {
      request(app).get('/api/characterTypes/' + characterTypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', characterType.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Character type with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/characterTypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Character type is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Character type which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Character type
    request(app).get('/api/characterTypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Character type with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Character type if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Character type
        agent.post('/api/characterTypes')
          .send(characterType)
          .expect(200)
          .end(function (characterTypeSaveErr, characterTypeSaveRes) {
            // Handle Character type save error
            if (characterTypeSaveErr) {
              return done(characterTypeSaveErr);
            }

            // Delete an existing Character type
            agent.delete('/api/characterTypes/' + characterTypeSaveRes.body._id)
              .send(characterType)
              .expect(200)
              .end(function (characterTypeDeleteErr, characterTypeDeleteRes) {
                // Handle characterType error error
                if (characterTypeDeleteErr) {
                  return done(characterTypeDeleteErr);
                }

                // Set assertions
                (characterTypeDeleteRes.body._id).should.equal(characterTypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Character type if not signed in', function (done) {
    // Set Character type user
    characterType.user = user;

    // Create new Character type model instance
    var characterTypeObj = new CharacterType(characterType);

    // Save the Character type
    characterTypeObj.save(function () {
      // Try deleting Character type
      request(app).delete('/api/characterTypes/' + characterTypeObj._id)
        .expect(403)
        .end(function (characterTypeDeleteErr, characterTypeDeleteRes) {
          // Set message assertion
          (characterTypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Character type error error
          done(characterTypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Character type that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Character type
          agent.post('/api/characterTypes')
            .send(characterType)
            .expect(200)
            .end(function (characterTypeSaveErr, characterTypeSaveRes) {
              // Handle Character type save error
              if (characterTypeSaveErr) {
                return done(characterTypeSaveErr);
              }

              // Set assertions on new Character type
              (characterTypeSaveRes.body.name).should.equal(characterType.name);
              should.exist(characterTypeSaveRes.body.user);
              should.equal(characterTypeSaveRes.body.user._id, orphanId);

              // force the Character type to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Character type
                    agent.get('/api/characterTypes/' + characterTypeSaveRes.body._id)
                      .expect(200)
                      .end(function (characterTypeInfoErr, characterTypeInfoRes) {
                        // Handle Character type error
                        if (characterTypeInfoErr) {
                          return done(characterTypeInfoErr);
                        }

                        // Set assertions
                        (characterTypeInfoRes.body._id).should.equal(characterTypeSaveRes.body._id);
                        (characterTypeInfoRes.body.name).should.equal(characterType.name);
                        should.equal(characterTypeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      CharacterType.remove().exec(done);
    });
  });
});
