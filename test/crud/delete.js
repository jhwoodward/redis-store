var redis = require('redis');
var expect = require('expect');
var del = require('../../src/crud/delete');
var read = require('../../src/crud/read');
var create = require('../../src/crud/create');

describe('Delete', function () {
  var type = 'test';
  var value1 = { name: 'test', value: 'elephant', tags: ['animal'] };
  var value2 = { name: 'test', value: 'testing' };
  var key;

  beforeEach(function (done) {
    del.all(type).then(() => {
      return create.one(type, value1).then(k => {
        expect(k).toExist();
        key = k;
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        var client = redis.createClient();
        client.smembers(type + ':animal', function (err, rep) {
          expect(rep).toExist();
          expect(rep.length).toEqual(1);
          resolve();
        });
      });
    }).then(() => {
      create.one(type, value2).then(k => {
        expect(k).toExist();
        done();
      });
    });
  });

  afterEach(function (done) {
    del.all(type).then(done);
  });

  it('should delete one', function (done) {
    var client = redis.createClient();
    read.one(type, key).then(result => {
      expect(result).toExist();
      expect(result.value).toEqual('elephant');
    }).then(() => {
      return new Promise((resolve, reject) => {
        var client = redis.createClient();
        client.smembers(type + ':animal', function (err, rep) {
          expect(rep).toExist();
          expect(rep.length).toEqual(1);
          resolve();
        });
      });
    }).then(() => {
      return del.one(type, key);
    }).then(() => {
      return read.one(type, key).catch(err => {
        expect(err).toEqual('not found');
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        client.exists(type + ':animal', function (err, rep) {
          expect(rep).toEqual(0);
          resolve();
        });
      });
    }).then(() => {
      client.smembers('tags:' + type, function (err, rep) {
        expect(rep.length).toEqual(0);
        done();
      });
    });
  });

  it('should delete all', function (done) {
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
      client.get('key:' + type, function (err, rep) {
        expect(rep).toEqual(null);
        client.get(type + ':animal', function (err, rep) {
          expect(rep).toEqual(null);
          client.get('tags:' + type, function (err, rep) {
            expect(rep).toEqual(null);
            done();
          });
        });
      });
    });
  });
});