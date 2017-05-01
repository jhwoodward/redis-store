var redis = require('redis');
var expect = require('expect');
var create = require('../../src/crud/create');
var read = require('../../src/crud/read');
var del = require('../../src/crud/delete');

describe('Create', function () {
  var type = 'test';

  beforeEach(function (done) {
    del.all(type).then(done);
  });

  it('should create one', function (done) {

    var value = { name: 'test', value: 'albatross', tags: ['bird'] };

    create.one(type, value).then(key => {
      expect(key).toExist();
      return key;
    }).then(key => {
      return read.one(type, key).then(result => {
        expect(result).toExist();
        expect(result.value).toEqual('albatross');
      });
    }).then(() => {
      return read.list(type, 'bird').then(result => {
        expect(result.length).toEqual(1);
      });
    }).then(() => {
       var client = redis.createClient();
       client.smembers('tags:' + type, function (err, rep) {
        expect(rep.length).toEqual(1);
        expect(rep[0]).toEqual('bird');
        client.quit();
        done();
      });
    });
  });

  it('should create list', function (done) {

    var type = 'test';
    var values = [
      { name: 'test1', value: 'beer', tags: ['food', 'drink'] },
      { name: 'test2', value: 'chips', tags: ['food'] },
      { name: 'test3', value: 'wine', tags: ['drink'] }
    ];

    create.list(type, values).then(keys => {
      expect(keys).toExist();
      expect(keys.length).toEqual(3);
      return keys;
    }).then(keys => {
      read.one(type, keys[1]).then(result => {
        expect(result).toExist();
        expect(result.value).toEqual('chips');
        done();
      });
    });
  });
});
