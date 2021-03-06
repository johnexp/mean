(function () {
  'use strict';

  describe('Ranks Route Tests', function () {
    // Initialize global variables
    var $scope,
      RanksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RanksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RanksService = _RanksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ranks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ranks');
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
          RanksController,
          mockRank;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ranks.view');
          $templateCache.put('modules/ranks/client/views/view-rank.client.view.html', '');

          // create mock Rank
          mockRank = new RanksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Rank Name'
          });

          // Initialize Controller
          RanksController = $controller('RanksController as vm', {
            $scope: $scope,
            rankResolve: mockRank
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:rankId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.rankResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            rankId: 1
          })).toEqual('/ranks/1');
        }));

        it('should attach an Rank to the controller scope', function () {
          expect($scope.vm.rank._id).toBe(mockRank._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ranks/client/views/view-rank.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RanksController,
          mockRank;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ranks.create');
          $templateCache.put('modules/ranks/client/views/form-rank.client.view.html', '');

          // create mock Rank
          mockRank = new RanksService();

          // Initialize Controller
          RanksController = $controller('RanksController as vm', {
            $scope: $scope,
            rankResolve: mockRank
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.rankResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ranks/create');
        }));

        it('should attach an Rank to the controller scope', function () {
          expect($scope.vm.rank._id).toBe(mockRank._id);
          expect($scope.vm.rank._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ranks/client/views/form-rank.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RanksController,
          mockRank;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ranks.edit');
          $templateCache.put('modules/ranks/client/views/form-rank.client.view.html', '');

          // create mock Rank
          mockRank = new RanksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Rank Name'
          });

          // Initialize Controller
          RanksController = $controller('RanksController as vm', {
            $scope: $scope,
            rankResolve: mockRank
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:rankId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.rankResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            rankId: 1
          })).toEqual('/ranks/1/edit');
        }));

        it('should attach an Rank to the controller scope', function () {
          expect($scope.vm.rank._id).toBe(mockRank._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ranks/client/views/form-rank.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
