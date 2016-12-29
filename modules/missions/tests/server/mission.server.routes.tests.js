'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mission = mongoose.model('Mission'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  mission;

/**
 * Mission routes tests
 */
describe('Mission CRUD tests', function () {

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

    // Save a user to the test db and create new Mission
    user.save(function () {
      mission = {
        name: 'Mission name'
      };

      done();
    });
  });

  it('should be able to save a Mission if logged in', function (done) {
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

        // Save a new Mission
        agent.post('/api/missions')
          .send(mission)
          .expect(200)
          .end(function (missionSaveErr, missionSaveRes) {
            // Handle Mission save error
            if (missionSaveErr) {
              return done(missionSaveErr);
            }

            // Get a list of Missions
            agent.get('/api/missions')
              .end(function (missionsGetErr, missionsGetRes) {
                // Handle Missions save error
                if (missionsGetErr) {
                  return done(missionsGetErr);
                }

                // Get Missions list
                var missions = missionsGetRes.body;

                // Set assertions
                (missions[0].user._id).should.equal(userId);
                (missions[0].name).should.match('Mission name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Mission if not logged in', function (done) {
    agent.post('/api/missions')
      .send(mission)
      .expect(403)
      .end(function (missionSaveErr, missionSaveRes) {
        // Call the assertion callback
        done(missionSaveErr);
      });
  });

  it('should not be able to save an Mission if no name is provided', function (done) {
    // Invalidate name field
    mission.name = '';

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

        // Save a new Mission
        agent.post('/api/missions')
          .send(mission)
          .expect(400)
          .end(function (missionSaveErr, missionSaveRes) {
            // Set message assertion
            (missionSaveRes.body.message).should.match('Please fill Mission name');

            // Handle Mission save error
            done(missionSaveErr);
          });
      });
  });

  it('should be able to update an Mission if signed in', function (done) {
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

        // Save a new Mission
        agent.post('/api/missions')
          .send(mission)
          .expect(200)
          .end(function (missionSaveErr, missionSaveRes) {
            // Handle Mission save error
            if (missionSaveErr) {
              return done(missionSaveErr);
            }

            // Update Mission name
            mission.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Mission
            agent.put('/api/missions/' + missionSaveRes.body._id)
              .send(mission)
              .expect(200)
              .end(function (missionUpdateErr, missionUpdateRes) {
                // Handle Mission update error
                if (missionUpdateErr) {
                  return done(missionUpdateErr);
                }

                // Set assertions
                (missionUpdateRes.body._id).should.equal(missionSaveRes.body._id);
                (missionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Missions if not signed in', function (done) {
    // Create new Mission model instance
    var missionObj = new Mission(mission);

    // Save the mission
    missionObj.save(function () {
      // Request Missions
      request(app).get('/api/missions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Mission if not signed in', function (done) {
    // Create new Mission model instance
    var missionObj = new Mission(mission);

    // Save the Mission
    missionObj.save(function () {
      request(app).get('/api/missions/' + missionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', mission.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Mission with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/missions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Mission is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Mission which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Mission
    request(app).get('/api/missions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Mission with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Mission if signed in', function (done) {
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

        // Save a new Mission
        agent.post('/api/missions')
          .send(mission)
          .expect(200)
          .end(function (missionSaveErr, missionSaveRes) {
            // Handle Mission save error
            if (missionSaveErr) {
              return done(missionSaveErr);
            }

            // Delete an existing Mission
            agent.delete('/api/missions/' + missionSaveRes.body._id)
              .send(mission)
              .expect(200)
              .end(function (missionDeleteErr, missionDeleteRes) {
                // Handle mission error error
                if (missionDeleteErr) {
                  return done(missionDeleteErr);
                }

                // Set assertions
                (missionDeleteRes.body._id).should.equal(missionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Mission if not signed in', function (done) {
    // Set Mission user
    mission.user = user;

    // Create new Mission model instance
    var missionObj = new Mission(mission);

    // Save the Mission
    missionObj.save(function () {
      // Try deleting Mission
      request(app).delete('/api/missions/' + missionObj._id)
        .expect(403)
        .end(function (missionDeleteErr, missionDeleteRes) {
          // Set message assertion
          (missionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Mission error error
          done(missionDeleteErr);
        });

    });
  });

  it('should be able to get a single Mission that has an orphaned user reference', function (done) {
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

          // Save a new Mission
          agent.post('/api/missions')
            .send(mission)
            .expect(200)
            .end(function (missionSaveErr, missionSaveRes) {
              // Handle Mission save error
              if (missionSaveErr) {
                return done(missionSaveErr);
              }

              // Set assertions on new Mission
              (missionSaveRes.body.name).should.equal(mission.name);
              should.exist(missionSaveRes.body.user);
              should.equal(missionSaveRes.body.user._id, orphanId);

              // force the Mission to have an orphaned user reference
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

                    // Get the Mission
                    agent.get('/api/missions/' + missionSaveRes.body._id)
                      .expect(200)
                      .end(function (missionInfoErr, missionInfoRes) {
                        // Handle Mission error
                        if (missionInfoErr) {
                          return done(missionInfoErr);
                        }

                        // Set assertions
                        (missionInfoRes.body._id).should.equal(missionSaveRes.body._id);
                        (missionInfoRes.body.name).should.equal(mission.name);
                        should.equal(missionInfoRes.body.user, undefined);

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
      Mission.remove().exec(done);
    });
  });
});
