'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rank = mongoose.model('Rank'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  rank;

/**
 * Rank routes tests
 */
describe('Rank CRUD tests', function () {

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

    // Save a user to the test db and create new Rank
    user.save(function () {
      rank = {
        name: 'Rank name'
      };

      done();
    });
  });

  it('should be able to save a Rank if logged in', function (done) {
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

        // Save a new Rank
        agent.post('/api/ranks')
          .send(rank)
          .expect(200)
          .end(function (rankSaveErr, rankSaveRes) {
            // Handle Rank save error
            if (rankSaveErr) {
              return done(rankSaveErr);
            }

            // Get a list of Ranks
            agent.get('/api/ranks')
              .end(function (ranksGetErr, ranksGetRes) {
                // Handle Ranks save error
                if (ranksGetErr) {
                  return done(ranksGetErr);
                }

                // Get Ranks list
                var ranks = ranksGetRes.body;

                // Set assertions
                (ranks[0].user._id).should.equal(userId);
                (ranks[0].name).should.match('Rank name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Rank if not logged in', function (done) {
    agent.post('/api/ranks')
      .send(rank)
      .expect(403)
      .end(function (rankSaveErr, rankSaveRes) {
        // Call the assertion callback
        done(rankSaveErr);
      });
  });

  it('should not be able to save an Rank if no name is provided', function (done) {
    // Invalidate name field
    rank.name = '';

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

        // Save a new Rank
        agent.post('/api/ranks')
          .send(rank)
          .expect(400)
          .end(function (rankSaveErr, rankSaveRes) {
            // Set message assertion
            (rankSaveRes.body.message).should.match('Please fill Rank name');

            // Handle Rank save error
            done(rankSaveErr);
          });
      });
  });

  it('should be able to update an Rank if signed in', function (done) {
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

        // Save a new Rank
        agent.post('/api/ranks')
          .send(rank)
          .expect(200)
          .end(function (rankSaveErr, rankSaveRes) {
            // Handle Rank save error
            if (rankSaveErr) {
              return done(rankSaveErr);
            }

            // Update Rank name
            rank.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Rank
            agent.put('/api/ranks/' + rankSaveRes.body._id)
              .send(rank)
              .expect(200)
              .end(function (rankUpdateErr, rankUpdateRes) {
                // Handle Rank update error
                if (rankUpdateErr) {
                  return done(rankUpdateErr);
                }

                // Set assertions
                (rankUpdateRes.body._id).should.equal(rankSaveRes.body._id);
                (rankUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ranks if not signed in', function (done) {
    // Create new Rank model instance
    var rankObj = new Rank(rank);

    // Save the rank
    rankObj.save(function () {
      // Request Ranks
      request(app).get('/api/ranks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Rank if not signed in', function (done) {
    // Create new Rank model instance
    var rankObj = new Rank(rank);

    // Save the Rank
    rankObj.save(function () {
      request(app).get('/api/ranks/' + rankObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', rank.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Rank with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ranks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Rank is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Rank which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Rank
    request(app).get('/api/ranks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Rank with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Rank if signed in', function (done) {
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

        // Save a new Rank
        agent.post('/api/ranks')
          .send(rank)
          .expect(200)
          .end(function (rankSaveErr, rankSaveRes) {
            // Handle Rank save error
            if (rankSaveErr) {
              return done(rankSaveErr);
            }

            // Delete an existing Rank
            agent.delete('/api/ranks/' + rankSaveRes.body._id)
              .send(rank)
              .expect(200)
              .end(function (rankDeleteErr, rankDeleteRes) {
                // Handle rank error error
                if (rankDeleteErr) {
                  return done(rankDeleteErr);
                }

                // Set assertions
                (rankDeleteRes.body._id).should.equal(rankSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Rank if not signed in', function (done) {
    // Set Rank user
    rank.user = user;

    // Create new Rank model instance
    var rankObj = new Rank(rank);

    // Save the Rank
    rankObj.save(function () {
      // Try deleting Rank
      request(app).delete('/api/ranks/' + rankObj._id)
        .expect(403)
        .end(function (rankDeleteErr, rankDeleteRes) {
          // Set message assertion
          (rankDeleteRes.body.message).should.match('User is not authorized');

          // Handle Rank error error
          done(rankDeleteErr);
        });

    });
  });

  it('should be able to get a single Rank that has an orphaned user reference', function (done) {
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

          // Save a new Rank
          agent.post('/api/ranks')
            .send(rank)
            .expect(200)
            .end(function (rankSaveErr, rankSaveRes) {
              // Handle Rank save error
              if (rankSaveErr) {
                return done(rankSaveErr);
              }

              // Set assertions on new Rank
              (rankSaveRes.body.name).should.equal(rank.name);
              should.exist(rankSaveRes.body.user);
              should.equal(rankSaveRes.body.user._id, orphanId);

              // force the Rank to have an orphaned user reference
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

                    // Get the Rank
                    agent.get('/api/ranks/' + rankSaveRes.body._id)
                      .expect(200)
                      .end(function (rankInfoErr, rankInfoRes) {
                        // Handle Rank error
                        if (rankInfoErr) {
                          return done(rankInfoErr);
                        }

                        // Set assertions
                        (rankInfoRes.body._id).should.equal(rankSaveRes.body._id);
                        (rankInfoRes.body.name).should.equal(rank.name);
                        should.equal(rankInfoRes.body.user, undefined);

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
      Rank.remove().exec(done);
    });
  });
});
