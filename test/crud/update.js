var redis = require('redis');
var expect = require('expect');
var create = require('../../src/crud/create');
var read = require('../../src/crud/read');
var update = require('../../src/crud/update');
var del = require('../../src/crud/delete');

describe('Update', function () {
  var type = 'test';
  var tiger = { name: 'tiger', angry: false, tags: ['cat'] };

  before(done => {
    del.all(type).then(() => {
      return create.one(type, tiger).then(key => {
        expect(key).toExist();
        tiger.key = key;
        done();
      });
    })
  });

  it('should update one', done => {
    tiger.angry = true;
    tiger.tags.push('aggressive');
    update.one(type, tiger).then(() => {
      return read.one(type, tiger.key).then(result => {
        expect(result.angry).toBeTruthy();
      });
    }).then(() => {
      return read.list(type, 'aggressive').then(result => {
        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual(tiger.name);
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        var client = redis.createClient();
        client.smembers('tags:' + type, (err, rep) => {
          expect(rep.length).toEqual(2);
          client.quit();
          resolve();
        });
      });
    }).then(() => {
      tiger.tags = ['passive'];
      return update.one(type, tiger);
    }).then(() => {
      return read.list(type, 'aggressive').then(result => {
        expect(result.length).toEqual(0);
      });
    }).then(() => {
      return read.tags(type).then(result => {
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual('passive');
      });
    }).then(() => {
      return read.list(type, 'passive').then(result => {
        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual(tiger.name);
        done();
      });
    })
  });
});
