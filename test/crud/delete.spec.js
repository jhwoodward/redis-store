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
    del.all(type, user).then(() => {
      return create.one(type, elephant, user).then(item => {
        expect(item.key).toExist();
        elephant.key = item.key;
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        var client = redis.createClient();
        client.smembers(type + ':' + user.key  + ':animal', (err, rep) => {
          expect(rep).toExist();
          expect(rep.length).toEqual(1);
          resolve();
        });
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
    del.all(type, user).then(done);
  });

  it('should delete one', done => {
    var client = redis.createClient();
    read.one(type, elephant.key, user).then(result => {
      expect(result).toExist();
      expect(result.name).toEqual(elephant.name);
    }).then(() => {
      return new Promise((resolve, reject) => {
        var client = redis.createClient();
        client.smembers(type + ':' + user.key + ':animal', (err, rep) => {
          expect(rep).toExist();
          expect(rep.length).toEqual(1);
          resolve();
        });
      });
    }).then(() => {
      return del.one(type, elephant.key, user);
    }).then(() => {
      return read.one(type, elephant.key, user).catch(err => {
        expect(err).toEqual('not found');
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        client.exists(type + ':' + user.key + ':animal', (err, rep) => {
          expect(rep).toEqual(0);
          resolve();
        });
      });
    }).then(() => {
      client.smembers('tags:' + type + ':' + user.key, (err, rep) => {
        expect(rep.length).toEqual(0);
        done();
      });
    });
  });

  it('should delete all', done => {
    read.all(type, user).then(result => {
      expect(result).toExist();
    }).then(() => {
      return del.all(type, user);
    }).then(() => {
      return read.all(type, user).catch(err => {
        expect(err).toEqual('not found');
      });
    }).then(() => {
      var client = redis.createClient();
      client.get('key:' + type + ':' + user.key, (err, rep) => {
        expect(rep).toNotExist();
        client.get(type + ':' + user.key + ':animal', (err, rep) => {
          expect(rep).toNotExist();
          client.get('tags:' + type + ':' + user.key, (err, rep) => {
            expect(rep).toNotExist();
            done();
          });
        });
      });
    });
  });
});