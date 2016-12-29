'use strict';

describe('Mission types E2E Tests:', function () {
  describe('Test Mission types page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mission-types');
      expect(element.all(by.repeater('mission-type in mission-types')).count()).toEqual(0);
    });
  });
});
