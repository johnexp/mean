(function () {
  'use strict';

  describe('Mission types Route Tests', function () {
    // Initialize global variables
    var $scope,
      MissionTypesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MissionTypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MissionTypesService = _MissionTypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('mission-types');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mission-types');
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
          MissionTypesController,
          mockMissionType;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('mission-types.view');
          $templateCache.put('modules/mission-types/client/views/view-mission-type.client.view.html', '');

          // create mock Mission type
          mockMissionType = new MissionTypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mission type Name'
          });

          // Initialize Controller
          MissionTypesController = $controller('MissionTypesController as vm', {
            $scope: $scope,
            missionTypeResolve: mockMissionType
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:missionTypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.missionTypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            missionTypeId: 1
          })).toEqual('/mission-types/1');
        }));

        it('should attach an Mission type to the controller scope', function () {
          expect($scope.vm.missionType._id).toBe(mockMissionType._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/mission-types/client/views/view-mission-type.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MissionTypesController,
          mockMissionType;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('mission-types.create');
          $templateCache.put('modules/mission-types/client/views/form-mission-type.client.view.html', '');

          // create mock Mission type
          mockMissionType = new MissionTypesService();

          // Initialize Controller
          MissionTypesController = $controller('MissionTypesController as vm', {
            $scope: $scope,
            missionTypeResolve: mockMissionType
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.missionTypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/mission-types/create');
        }));

        it('should attach an Mission type to the controller scope', function () {
          expect($scope.vm.missionType._id).toBe(mockMissionType._id);
          expect($scope.vm.missionType._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/mission-types/client/views/form-mission-type.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MissionTypesController,
          mockMissionType;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('mission-types.edit');
          $templateCache.put('modules/mission-types/client/views/form-mission-type.client.view.html', '');

          // create mock Mission type
          mockMissionType = new MissionTypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mission type Name'
          });

          // Initialize Controller
          MissionTypesController = $controller('MissionTypesController as vm', {
            $scope: $scope,
            missionTypeResolve: mockMissionType
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:missionTypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.missionTypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            missionTypeId: 1
          })).toEqual('/mission-types/1/edit');
        }));

        it('should attach an Mission type to the controller scope', function () {
          expect($scope.vm.missionType._id).toBe(mockMissionType._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/mission-types/client/views/form-missionType.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
