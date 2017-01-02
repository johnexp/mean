'use strict';

describe('Ranks E2E Tests:', function () {
  describe('Test Ranks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ranks');
      expect(element.all(by.repeater('rank in ranks')).count()).toEqual(0);
    });
  });
});
