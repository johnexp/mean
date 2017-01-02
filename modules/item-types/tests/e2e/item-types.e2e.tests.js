'use strict';

describe('Item types E2E Tests:', function () {
  describe('Test Item types page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/item-types');
      expect(element.all(by.repeater('item-type in item-types')).count()).toEqual(0);
    });
  });
});
