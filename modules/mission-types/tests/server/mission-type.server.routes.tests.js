'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  MissionType = mongoose.model('MissionType'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  missionType;

/**
 * Mission type routes tests
 */
describe('Mission type CRUD tests', function () {

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

    // Save a user to the test db and create new Mission type
    user.save(function () {
      missionType = {
        name: 'Mission type name'
      };

      done();
    });
  });

  it('should be able to save a Mission type if logged in', function (done) {
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

        // Save a new Mission type
        agent.post('/api/missionTypes')
          .send(missionType)
          .expect(200)
          .end(function (missionTypeSaveErr, missionTypeSaveRes) {
            // Handle Mission type save error
            if (missionTypeSaveErr) {
              return done(missionTypeSaveErr);
            }

            // Get a list of Mission types
            agent.get('/api/missionTypes')
              .end(function (missionTypesGetErr, missionTypesGetRes) {
                // Handle Mission types save error
                if (missionTypesGetErr) {
                  return done(missionTypesGetErr);
                }

                // Get Mission types list
                var missionTypes = missionTypesGetRes.body;

                // Set assertions
                (missionTypes[0].user._id).should.equal(userId);
                (missionTypes[0].name).should.match('Mission type name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Mission type if not logged in', function (done) {
    agent.post('/api/missionTypes')
      .send(missionType)
      .expect(403)
      .end(function (missionTypeSaveErr, missionTypeSaveRes) {
        // Call the assertion callback
        done(missionTypeSaveErr);
      });
  });

  it('should not be able to save an Mission type if no name is provided', function (done) {
    // Invalidate name field
    missionType.name = '';

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

        // Save a new Mission type
        agent.post('/api/missionTypes')
          .send(missionType)
          .expect(400)
          .end(function (missionTypeSaveErr, missionTypeSaveRes) {
            // Set message assertion
            (missionTypeSaveRes.body.message).should.match('Please fill Mission type name');

            // Handle Mission type save error
            done(missionTypeSaveErr);
          });
      });
  });

  it('should be able to update an Mission type if signed in', function (done) {
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

        // Save a new Mission type
        agent.post('/api/missionTypes')
          .send(missionType)
          .expect(200)
          .end(function (missionTypeSaveErr, missionTypeSaveRes) {
            // Handle Mission type save error
            if (missionTypeSaveErr) {
              return done(missionTypeSaveErr);
            }

            // Update Mission type name
            missionType.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Mission type
            agent.put('/api/missionTypes/' + missionTypeSaveRes.body._id)
              .send(missionType)
              .expect(200)
              .end(function (missionTypeUpdateErr, missionTypeUpdateRes) {
                // Handle Mission type update error
                if (missionTypeUpdateErr) {
                  return done(missionTypeUpdateErr);
                }

                // Set assertions
                (missionTypeUpdateRes.body._id).should.equal(missionTypeSaveRes.body._id);
                (missionTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Mission types if not signed in', function (done) {
    // Create new Mission type model instance
    var missionTypeObj = new MissionType(missionType);

    // Save the missionType
    missionTypeObj.save(function () {
      // Request Mission types
      request(app).get('/api/missionTypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Mission type if not signed in', function (done) {
    // Create new Mission type model instance
    var missionTypeObj = new MissionType(missionType);

    // Save the Mission type
    missionTypeObj.save(function () {
      request(app).get('/api/missionTypes/' + missionTypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', missionType.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Mission type with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/missionTypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Mission type is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Mission type which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Mission type
    request(app).get('/api/missionTypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Mission type with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Mission type if signed in', function (done) {
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

        // Save a new Mission type
        agent.post('/api/missionTypes')
          .send(missionType)
          .expect(200)
          .end(function (missionTypeSaveErr, missionTypeSaveRes) {
            // Handle Mission type save error
            if (missionTypeSaveErr) {
              return done(missionTypeSaveErr);
            }

            // Delete an existing Mission type
            agent.delete('/api/missionTypes/' + missionTypeSaveRes.body._id)
              .send(missionType)
              .expect(200)
              .end(function (missionTypeDeleteErr, missionTypeDeleteRes) {
                // Handle missionType error error
                if (missionTypeDeleteErr) {
                  return done(missionTypeDeleteErr);
                }

                // Set assertions
                (missionTypeDeleteRes.body._id).should.equal(missionTypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Mission type if not signed in', function (done) {
    // Set Mission type user
    missionType.user = user;

    // Create new Mission type model instance
    var missionTypeObj = new MissionType(missionType);

    // Save the Mission type
    missionTypeObj.save(function () {
      // Try deleting Mission type
      request(app).delete('/api/missionTypes/' + missionTypeObj._id)
        .expect(403)
        .end(function (missionTypeDeleteErr, missionTypeDeleteRes) {
          // Set message assertion
          (missionTypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Mission type error error
          done(missionTypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Mission type that has an orphaned user reference', function (done) {
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

          // Save a new Mission type
          agent.post('/api/missionTypes')
            .send(missionType)
            .expect(200)
            .end(function (missionTypeSaveErr, missionTypeSaveRes) {
              // Handle Mission type save error
              if (missionTypeSaveErr) {
                return done(missionTypeSaveErr);
              }

              // Set assertions on new Mission type
              (missionTypeSaveRes.body.name).should.equal(missionType.name);
              should.exist(missionTypeSaveRes.body.user);
              should.equal(missionTypeSaveRes.body.user._id, orphanId);

              // force the Mission type to have an orphaned user reference
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

                    // Get the Mission type
                    agent.get('/api/missionTypes/' + missionTypeSaveRes.body._id)
                      .expect(200)
                      .end(function (missionTypeInfoErr, missionTypeInfoRes) {
                        // Handle Mission type error
                        if (missionTypeInfoErr) {
                          return done(missionTypeInfoErr);
                        }

                        // Set assertions
                        (missionTypeInfoRes.body._id).should.equal(missionTypeSaveRes.body._id);
                        (missionTypeInfoRes.body.name).should.equal(missionType.name);
                        should.equal(missionTypeInfoRes.body.user, undefined);

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
      MissionType.remove().exec(done);
    });
  });
});
