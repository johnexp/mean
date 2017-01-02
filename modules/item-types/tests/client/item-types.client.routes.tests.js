(function () {
  'use strict';

  describe('Item types Route Tests', function () {
    // Initialize global variables
    var $scope,
      ItemTypesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ItemTypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ItemTypesService = _ItemTypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('item-types');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/item-types');
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
          ItemTypesController,
          mockItemType;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('item-types.view');
          $templateCache.put('modules/item-types/client/views/view-item-type.client.view.html', '');

          // create mock Item type
          mockItemType = new ItemTypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Item type Name'
          });

          // Initialize Controller
          ItemTypesController = $controller('ItemTypesController as vm', {
            $scope: $scope,
            itemTypeResolve: mockItemType
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:itemTypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.itemTypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            itemTypeId: 1
          })).toEqual('/item-types/1');
        }));

        it('should attach an Item type to the controller scope', function () {
          expect($scope.vm.itemType._id).toBe(mockItemType._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/item-types/client/views/view-item-type.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ItemTypesController,
          mockItemType;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('item-types.create');
          $templateCache.put('modules/item-types/client/views/form-item-type.client.view.html', '');

          // create mock Item type
          mockItemType = new ItemTypesService();

          // Initialize Controller
          ItemTypesController = $controller('ItemTypesController as vm', {
            $scope: $scope,
            itemTypeResolve: mockItemType
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.itemTypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/item-types/create');
        }));

        it('should attach an Item type to the controller scope', function () {
          expect($scope.vm.itemType._id).toBe(mockItemType._id);
          expect($scope.vm.itemType._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/item-types/client/views/form-item-type.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ItemTypesController,
          mockItemType;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('item-types.edit');
          $templateCache.put('modules/item-types/client/views/form-item-type.client.view.html', '');

          // create mock Item type
          mockItemType = new ItemTypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Item type Name'
          });

          // Initialize Controller
          ItemTypesController = $controller('ItemTypesController as vm', {
            $scope: $scope,
            itemTypeResolve: mockItemType
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:itemTypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.itemTypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            itemTypeId: 1
          })).toEqual('/item-types/1/edit');
        }));

        it('should attach an Item type to the controller scope', function () {
          expect($scope.vm.itemType._id).toBe(mockItemType._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/item-types/client/views/form-itemType.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
