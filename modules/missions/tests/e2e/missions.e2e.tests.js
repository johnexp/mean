'use strict';

describe('Missions E2E Tests:', function () {
  describe('Test Missions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/missions');
      expect(element.all(by.repeater('mission in missions')).count()).toEqual(0);
    });
  });
});
