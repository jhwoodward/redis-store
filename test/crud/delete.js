var redis = require('redis');
var expect = require('expect');
var del = require('../../src/crud/delete');
var read = require('../../src/crud/read');
var create = require('../../src/crud/create');

describe('Delete', function () {
  var type = 'test';
  var elephant = { name: 'elephant', tags: ['animal'] };
  var snake = { name: 'snake' };

  beforeEach(done => {
    del.all(type).then(() => {
      return create.one(type, elephant).then(key => {
        expect(key).toExist();
        elephant.key = key;
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        var client = redis.createClient();
        client.smembers(type + ':animal', (err, rep) => {
          expect(rep).toExist();
          expect(rep.length).toEqual(1);
          resolve();
        });
      });
    }).then(() => {
      create.one(type, snake).then(key => {
        expect(key).toExist();
        snake.key = key;
        done();
      });
    });
  });

  afterEach(done => {
    del.all(type).then(done);
  });

  it('should delete one', done => {
    var client = redis.createClient();
    read.one(type, elephant.key).then(result => {
      expect(result).toExist();
      expect(result.name).toEqual(elephant.name);
    }).then(() => {
      return new Promise((resolve, reject) => {
        var client = redis.createClient();
        client.smembers(type + ':animal', (err, rep) => {
          expect(rep).toExist();
          expect(rep.length).toEqual(1);
          resolve();
        });
      });
    }).then(() => {
      return del.one(type, elephant.key);
    }).then(() => {
      return read.one(type, elephant.key).catch(err => {
        expect(err).toEqual('not found');
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        client.exists(type + ':animal', (err, rep) => {
          expect(rep).toEqual(0);
          resolve();
        });
      });
    }).then(() => {
      client.smembers('tags:' + type, (err, rep) => {
        expect(rep.length).toEqual(0);
        done();
      });
    });
  });

  it('should delete all', done => {
    read.all(type).then(result => {
      expect(result).toExist();
    }).then(() => {
      return del.all(type);
    }).then(() => {
      return read.all(type).catch(err => {
        expect(err).toEqual('not found');
      });
    }).then(() => {
      var client = redis.createClient();
      client.get('key:' + type, (err, rep) => {
        expect(rep).toNotExist();
        client.get(type + ':animal', (err, rep) => {
          expect(rep).toNotExist();
          client.get('tags:' + type, (err, rep) => {
            expect(rep).toNotExist();
            done();
          });
        });
      });
    });
  });
});