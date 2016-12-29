(function () {
  'use strict';

  describe('Missions Route Tests', function () {
    // Initialize global variables
    var $scope,
      MissionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MissionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MissionsService = _MissionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('missions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/missions');
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
          MissionsController,
          mockMission;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('missions.view');
          $templateCache.put('modules/missions/client/views/view-mission.client.view.html', '');

          // create mock Mission
          mockMission = new MissionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mission Name'
          });

          // Initialize Controller
          MissionsController = $controller('MissionsController as vm', {
            $scope: $scope,
            missionResolve: mockMission
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:missionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.missionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            missionId: 1
          })).toEqual('/missions/1');
        }));

        it('should attach an Mission to the controller scope', function () {
          expect($scope.vm.mission._id).toBe(mockMission._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/missions/client/views/view-mission.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MissionsController,
          mockMission;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('missions.create');
          $templateCache.put('modules/missions/client/views/form-mission.client.view.html', '');

          // create mock Mission
          mockMission = new MissionsService();

          // Initialize Controller
          MissionsController = $controller('MissionsController as vm', {
            $scope: $scope,
            missionResolve: mockMission
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.missionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/missions/create');
        }));

        it('should attach an Mission to the controller scope', function () {
          expect($scope.vm.mission._id).toBe(mockMission._id);
          expect($scope.vm.mission._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/missions/client/views/form-mission.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MissionsController,
          mockMission;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('missions.edit');
          $templateCache.put('modules/missions/client/views/form-mission.client.view.html', '');

          // create mock Mission
          mockMission = new MissionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mission Name'
          });

          // Initialize Controller
          MissionsController = $controller('MissionsController as vm', {
            $scope: $scope,
            missionResolve: mockMission
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:missionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.missionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            missionId: 1
          })).toEqual('/missions/1/edit');
        }));

        it('should attach an Mission to the controller scope', function () {
          expect($scope.vm.mission._id).toBe(mockMission._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/missions/client/views/form-mission.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
