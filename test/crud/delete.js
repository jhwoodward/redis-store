var expect = require('expect');
var del = require('../../src/crud/delete');
var read = require('../../src/crud/read');
var create = require('../../src/crud/create');

describe('Delete', function () {
  var type = 'test';
  var value = { name: 'test', value: 'testing' };
  var key;

  beforeEach(function(done) {
    create(type, value).then(k => {
      expect(k).toExist();
      key = k;
      done();
    });
  });

  it('should delete', function (done) {
    read.getOne(type, key).then(result => {
      expect(result).toExist();
    }).then(() => {
      return del(type, key);
    }).then(() => {
      read.getOne(type, key).catch(err => {
        expect(err).toEqual('not found');
        done();
      })
    });
  });
});