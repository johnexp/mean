'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adventure = mongoose.model('Adventure'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  adventure;

/**
 * Adventure routes tests
 */
describe('Adventure CRUD tests', function () {

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

    // Save a user to the test db and create new Adventure
    user.save(function () {
      adventure = {
        name: 'Adventure name'
      };

      done();
    });
  });

  it('should be able to save a Adventure if logged in', function (done) {
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

        // Save a new Adventure
        agent.post('/api/adventures')
          .send(adventure)
          .expect(200)
          .end(function (adventureSaveErr, adventureSaveRes) {
            // Handle Adventure save error
            if (adventureSaveErr) {
              return done(adventureSaveErr);
            }

            // Get a list of Adventures
            agent.get('/api/adventures')
              .end(function (adventuresGetErr, adventuresGetRes) {
                // Handle Adventures save error
                if (adventuresGetErr) {
                  return done(adventuresGetErr);
                }

                // Get Adventures list
                var adventures = adventuresGetRes.body;

                // Set assertions
                (adventures[0].user._id).should.equal(userId);
                (adventures[0].name).should.match('Adventure name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adventure if not logged in', function (done) {
    agent.post('/api/adventures')
      .send(adventure)
      .expect(403)
      .end(function (adventureSaveErr, adventureSaveRes) {
        // Call the assertion callback
        done(adventureSaveErr);
      });
  });

  it('should not be able to save an Adventure if no name is provided', function (done) {
    // Invalidate name field
    adventure.name = '';

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

        // Save a new Adventure
        agent.post('/api/adventures')
          .send(adventure)
          .expect(400)
          .end(function (adventureSaveErr, adventureSaveRes) {
            // Set message assertion
            (adventureSaveRes.body.message).should.match('Please fill Adventure name');

            // Handle Adventure save error
            done(adventureSaveErr);
          });
      });
  });

  it('should be able to update an Adventure if signed in', function (done) {
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

        // Save a new Adventure
        agent.post('/api/adventures')
          .send(adventure)
          .expect(200)
          .end(function (adventureSaveErr, adventureSaveRes) {
            // Handle Adventure save error
            if (adventureSaveErr) {
              return done(adventureSaveErr);
            }

            // Update Adventure name
            adventure.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adventure
            agent.put('/api/adventures/' + adventureSaveRes.body._id)
              .send(adventure)
              .expect(200)
              .end(function (adventureUpdateErr, adventureUpdateRes) {
                // Handle Adventure update error
                if (adventureUpdateErr) {
                  return done(adventureUpdateErr);
                }

                // Set assertions
                (adventureUpdateRes.body._id).should.equal(adventureSaveRes.body._id);
                (adventureUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Adventures if not signed in', function (done) {
    // Create new Adventure model instance
    var adventureObj = new Adventure(adventure);

    // Save the adventure
    adventureObj.save(function () {
      // Request Adventures
      request(app).get('/api/adventures')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adventure if not signed in', function (done) {
    // Create new Adventure model instance
    var adventureObj = new Adventure(adventure);

    // Save the Adventure
    adventureObj.save(function () {
      request(app).get('/api/adventures/' + adventureObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', adventure.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adventure with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adventures/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adventure is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adventure which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adventure
    request(app).get('/api/adventures/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adventure with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adventure if signed in', function (done) {
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

        // Save a new Adventure
        agent.post('/api/adventures')
          .send(adventure)
          .expect(200)
          .end(function (adventureSaveErr, adventureSaveRes) {
            // Handle Adventure save error
            if (adventureSaveErr) {
              return done(adventureSaveErr);
            }

            // Delete an existing Adventure
            agent.delete('/api/adventures/' + adventureSaveRes.body._id)
              .send(adventure)
              .expect(200)
              .end(function (adventureDeleteErr, adventureDeleteRes) {
                // Handle adventure error error
                if (adventureDeleteErr) {
                  return done(adventureDeleteErr);
                }

                // Set assertions
                (adventureDeleteRes.body._id).should.equal(adventureSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adventure if not signed in', function (done) {
    // Set Adventure user
    adventure.user = user;

    // Create new Adventure model instance
    var adventureObj = new Adventure(adventure);

    // Save the Adventure
    adventureObj.save(function () {
      // Try deleting Adventure
      request(app).delete('/api/adventures/' + adventureObj._id)
        .expect(403)
        .end(function (adventureDeleteErr, adventureDeleteRes) {
          // Set message assertion
          (adventureDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adventure error error
          done(adventureDeleteErr);
        });

    });
  });

  it('should be able to get a single Adventure that has an orphaned user reference', function (done) {
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

          // Save a new Adventure
          agent.post('/api/adventures')
            .send(adventure)
            .expect(200)
            .end(function (adventureSaveErr, adventureSaveRes) {
              // Handle Adventure save error
              if (adventureSaveErr) {
                return done(adventureSaveErr);
              }

              // Set assertions on new Adventure
              (adventureSaveRes.body.name).should.equal(adventure.name);
              should.exist(adventureSaveRes.body.user);
              should.equal(adventureSaveRes.body.user._id, orphanId);

              // force the Adventure to have an orphaned user reference
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

                    // Get the Adventure
                    agent.get('/api/adventures/' + adventureSaveRes.body._id)
                      .expect(200)
                      .end(function (adventureInfoErr, adventureInfoRes) {
                        // Handle Adventure error
                        if (adventureInfoErr) {
                          return done(adventureInfoErr);
                        }

                        // Set assertions
                        (adventureInfoRes.body._id).should.equal(adventureSaveRes.body._id);
                        (adventureInfoRes.body.name).should.equal(adventure.name);
                        should.equal(adventureInfoRes.body.user, undefined);

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
      Adventure.remove().exec(done);
    });
  });
});
