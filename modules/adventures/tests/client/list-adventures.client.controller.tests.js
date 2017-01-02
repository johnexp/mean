(function () {
  'use strict';

  describe('Adventures List Controller Tests', function () {
    // Initialize global variables
    var AdventuresListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AdventuresService,
      mockAdventure;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AdventuresService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AdventuresService = _AdventuresService_;

      // create mock article
      mockAdventure = new AdventuresService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Adventure Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Adventures List controller.
      AdventuresListController = $controller('AdventuresListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockAdventureList;

      beforeEach(function () {
        mockAdventureList = [mockAdventure, mockAdventure];
      });

      it('should send a GET request and return all Adventures', inject(function (AdventuresService) {
        // Set POST response
        $httpBackend.expectGET('api/adventures').respond(mockAdventureList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.adventures.length).toEqual(2);
        expect($scope.vm.adventures[0]).toEqual(mockAdventure);
        expect($scope.vm.adventures[1]).toEqual(mockAdventure);

      }));
    });
  });
}());
