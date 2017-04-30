var expect = require('expect');
var create = require('../../src/crud/create');
var read = require('../../src/crud/read');

describe('Create', function () {

  it('should create', function (done) {

    var type = 'test';
    var value = { name: 'test', value: 'testing' };

    create(type, value).then(key => {
      expect(key).toExist();
      return key;
    }).then((key) => {
      read.getOne(type, key).then(result => {
        expect(result).toExist();
        expect(result).toEqual(value);
        done();
      });
    });
  });
});
