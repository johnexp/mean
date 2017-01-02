(function () {
  'use strict';

  describe('Adventures Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdventuresService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdventuresService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdventuresService = _AdventuresService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('adventures');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/adventures');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AdventuresController,
          mockAdventure;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('adventures.view');
          $templateCache.put('modules/adventures/client/views/view-adventure.client.view.html', '');

          // create mock Adventure
          mockAdventure = new AdventuresService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adventure Name'
          });

          // Initialize Controller
          AdventuresController = $controller('AdventuresController as vm', {
            $scope: $scope,
            adventureResolve: mockAdventure
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:adventureId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.adventureResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            adventureId: 1
          })).toEqual('/adventures/1');
        }));

        it('should attach an Adventure to the controller scope', function () {
          expect($scope.vm.adventure._id).toBe(mockAdventure._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/adventures/client/views/view-adventure.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdventuresController,
          mockAdventure;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('adventures.create');
          $templateCache.put('modules/adventures/client/views/form-adventure.client.view.html', '');

          // create mock Adventure
          mockAdventure = new AdventuresService();

          // Initialize Controller
          AdventuresController = $controller('AdventuresController as vm', {
            $scope: $scope,
            adventureResolve: mockAdventure
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.adventureResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/adventures/create');
        }));

        it('should attach an Adventure to the controller scope', function () {
          expect($scope.vm.adventure._id).toBe(mockAdventure._id);
          expect($scope.vm.adventure._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/adventures/client/views/form-adventure.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdventuresController,
          mockAdventure;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('adventures.edit');
          $templateCache.put('modules/adventures/client/views/form-adventure.client.view.html', '');

          // create mock Adventure
          mockAdventure = new AdventuresService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Adventure Name'
          });

          // Initialize Controller
          AdventuresController = $controller('AdventuresController as vm', {
            $scope: $scope,
            adventureResolve: mockAdventure
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:adventureId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.adventureResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            adventureId: 1
          })).toEqual('/adventures/1/edit');
        }));

        it('should attach an Adventure to the controller scope', function () {
          expect($scope.vm.adventure._id).toBe(mockAdventure._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/adventures/client/views/form-adventure.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
