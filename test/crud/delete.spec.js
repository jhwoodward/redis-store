var redis = require('redis');
var expect = require('expect');
var del = require('../../src/crud/delete');
var read = require('../../src/crud/read');
var create = require('../../src/crud/create');

describe('Delete', function () {
  var type = 'teststore';
  var user = { key: 'testowner' };
  var elephant = { name: 'elephant', tags: ['animal'] };
  var snake = { name: 'snake' };

  beforeEach(done => {
    del.all(type).then(() => {
      return create.one(type, elephant, user).then(item => {
        expect(item.key).toExist();
        elephant.key = item.key;
      });
    }).then(() => {
      create.one(type, snake, user).then(item => {
        expect(item.key).toExist();
        snake = item;
        done();
      });
    });
  });

  afterEach(done => {
    del.all(type).then(done);
  });

  it('should delete one', done => {
    var client = redis.createClient();
    read.one(type, elephant.key, user.key).then(result => {
      expect(result).toExist();
      expect(result.name).toEqual(elephant.name);
    })/*.then(() => {
      return new Promise((resolve, reject) => {
        var client = redis.createClient();
        client.smembers(type + ':' + user.key + ':animal', (err, rep) => {
          expect(rep).toExist();
          expect(rep.length).toEqual(1);
          resolve();
        });
      });
    })*/.then(() => {
      return del.one(type, elephant.key, user);
    }).then(() => {
      return read.one(type, elephant.key, user.key).catch(err => {
        expect(err).toEqual('not found');
        done();
      })
    });
  });

  it('should delete all', done => {
    read.all(type).then(result => {
      expect(result).toExist();
    }).then(() => {
      return del.all(type);
    }).then(() => {
      return read.all(type).then(result => {
        expect(result.length).toBeFalsy();
        done();
      });
    });
  });
});