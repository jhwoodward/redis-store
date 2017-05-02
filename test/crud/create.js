var redis = require('redis');
var expect = require('expect');
var create = require('../../src/crud/create');
var read = require('../../src/crud/read');
var del = require('../../src/crud/delete');

describe('Create', function () {
  var type = 'test';

  beforeEach(done => {
    del.all(type).then(done);
  });

  it('should create one', done => {

    var albatross = { name: 'test', tags: ['bird'] };

    create.one(type, albatross).then(key => {
      expect(key).toExist();
      albatross.key = key;
      return key;
    }).then(key => {
      return read.one(type, key).then(result => {
        expect(result).toExist();
        expect(result.name).toEqual(albatross.name);
      });
    }).then(() => {
      return read.list(type, 'bird').then(result => {
        expect(result.length).toEqual(1);
      });
    }).then(() => {
       var client = redis.createClient();
       client.smembers('tags:' + type, (err, rep) => {
        expect(rep.length).toEqual(1);
        expect(rep[0]).toEqual('bird');
        client.quit();
        done();
      });
    });
  });

  it('should create list', done => {

    var type = 'test';
    var stuff = [
      { name: 'beer', tags: ['food', 'drink'] },
      { name: 'chips', tags: ['food'] },
      { name: 'wine', tags: ['drink'] }
    ];

    create.list(type, stuff).then(keys => {
      expect(keys).toExist();
      expect(keys.length).toEqual(3);
      return keys;
    }).then(keys => {
      read.one(type, keys[1]).then(result => {
        expect(result).toExist();
        expect(result.name).toEqual('chips');
        done();
      });
    });
  });
});
