'use strict';

describe('Character types E2E Tests:', function () {
  describe('Test Character types page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/character-types');
      expect(element.all(by.repeater('character-type in character-types')).count()).toEqual(0);
    });
  });
});
