'use strict';

describe('Adventures E2E Tests:', function () {
  describe('Test Adventures page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adventures');
      expect(element.all(by.repeater('adventure in adventures')).count()).toEqual(0);
    });
  });
});
