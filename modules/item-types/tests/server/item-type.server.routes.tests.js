'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ItemType = mongoose.model('ItemType'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  itemType;

/**
 * Item type routes tests
 */
describe('Item type CRUD tests', function () {

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

    // Save a user to the test db and create new Item type
    user.save(function () {
      itemType = {
        name: 'Item type name'
      };

      done();
    });
  });

  it('should be able to save a Item type if logged in', function (done) {
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

        // Save a new Item type
        agent.post('/api/itemTypes')
          .send(itemType)
          .expect(200)
          .end(function (itemTypeSaveErr, itemTypeSaveRes) {
            // Handle Item type save error
            if (itemTypeSaveErr) {
              return done(itemTypeSaveErr);
            }

            // Get a list of Item types
            agent.get('/api/itemTypes')
              .end(function (itemTypesGetErr, itemTypesGetRes) {
                // Handle Item types save error
                if (itemTypesGetErr) {
                  return done(itemTypesGetErr);
                }

                // Get Item types list
                var itemTypes = itemTypesGetRes.body;

                // Set assertions
                (itemTypes[0].user._id).should.equal(userId);
                (itemTypes[0].name).should.match('Item type name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Item type if not logged in', function (done) {
    agent.post('/api/itemTypes')
      .send(itemType)
      .expect(403)
      .end(function (itemTypeSaveErr, itemTypeSaveRes) {
        // Call the assertion callback
        done(itemTypeSaveErr);
      });
  });

  it('should not be able to save an Item type if no name is provided', function (done) {
    // Invalidate name field
    itemType.name = '';

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

        // Save a new Item type
        agent.post('/api/itemTypes')
          .send(itemType)
          .expect(400)
          .end(function (itemTypeSaveErr, itemTypeSaveRes) {
            // Set message assertion
            (itemTypeSaveRes.body.message).should.match('Please fill Item type name');

            // Handle Item type save error
            done(itemTypeSaveErr);
          });
      });
  });

  it('should be able to update an Item type if signed in', function (done) {
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

        // Save a new Item type
        agent.post('/api/itemTypes')
          .send(itemType)
          .expect(200)
          .end(function (itemTypeSaveErr, itemTypeSaveRes) {
            // Handle Item type save error
            if (itemTypeSaveErr) {
              return done(itemTypeSaveErr);
            }

            // Update Item type name
            itemType.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Item type
            agent.put('/api/itemTypes/' + itemTypeSaveRes.body._id)
              .send(itemType)
              .expect(200)
              .end(function (itemTypeUpdateErr, itemTypeUpdateRes) {
                // Handle Item type update error
                if (itemTypeUpdateErr) {
                  return done(itemTypeUpdateErr);
                }

                // Set assertions
                (itemTypeUpdateRes.body._id).should.equal(itemTypeSaveRes.body._id);
                (itemTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Item types if not signed in', function (done) {
    // Create new Item type model instance
    var itemTypeObj = new ItemType(itemType);

    // Save the itemType
    itemTypeObj.save(function () {
      // Request Item types
      request(app).get('/api/itemTypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Item type if not signed in', function (done) {
    // Create new Item type model instance
    var itemTypeObj = new ItemType(itemType);

    // Save the Item type
    itemTypeObj.save(function () {
      request(app).get('/api/itemTypes/' + itemTypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', itemType.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Item type with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/itemTypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Item type is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Item type which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Item type
    request(app).get('/api/itemTypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Item type with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Item type if signed in', function (done) {
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

        // Save a new Item type
        agent.post('/api/itemTypes')
          .send(itemType)
          .expect(200)
          .end(function (itemTypeSaveErr, itemTypeSaveRes) {
            // Handle Item type save error
            if (itemTypeSaveErr) {
              return done(itemTypeSaveErr);
            }

            // Delete an existing Item type
            agent.delete('/api/itemTypes/' + itemTypeSaveRes.body._id)
              .send(itemType)
              .expect(200)
              .end(function (itemTypeDeleteErr, itemTypeDeleteRes) {
                // Handle itemType error error
                if (itemTypeDeleteErr) {
                  return done(itemTypeDeleteErr);
                }

                // Set assertions
                (itemTypeDeleteRes.body._id).should.equal(itemTypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Item type if not signed in', function (done) {
    // Set Item type user
    itemType.user = user;

    // Create new Item type model instance
    var itemTypeObj = new ItemType(itemType);

    // Save the Item type
    itemTypeObj.save(function () {
      // Try deleting Item type
      request(app).delete('/api/itemTypes/' + itemTypeObj._id)
        .expect(403)
        .end(function (itemTypeDeleteErr, itemTypeDeleteRes) {
          // Set message assertion
          (itemTypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Item type error error
          done(itemTypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Item type that has an orphaned user reference', function (done) {
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

          // Save a new Item type
          agent.post('/api/itemTypes')
            .send(itemType)
            .expect(200)
            .end(function (itemTypeSaveErr, itemTypeSaveRes) {
              // Handle Item type save error
              if (itemTypeSaveErr) {
                return done(itemTypeSaveErr);
              }

              // Set assertions on new Item type
              (itemTypeSaveRes.body.name).should.equal(itemType.name);
              should.exist(itemTypeSaveRes.body.user);
              should.equal(itemTypeSaveRes.body.user._id, orphanId);

              // force the Item type to have an orphaned user reference
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

                    // Get the Item type
                    agent.get('/api/itemTypes/' + itemTypeSaveRes.body._id)
                      .expect(200)
                      .end(function (itemTypeInfoErr, itemTypeInfoRes) {
                        // Handle Item type error
                        if (itemTypeInfoErr) {
                          return done(itemTypeInfoErr);
                        }

                        // Set assertions
                        (itemTypeInfoRes.body._id).should.equal(itemTypeSaveRes.body._id);
                        (itemTypeInfoRes.body.name).should.equal(itemType.name);
                        should.equal(itemTypeInfoRes.body.user, undefined);

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
      ItemType.remove().exec(done);
    });
  });
});
