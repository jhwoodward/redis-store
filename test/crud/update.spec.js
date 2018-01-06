var redis = require('redis');
var expect = require('expect');
var create = require('../../src/crud/create');
var read = require('../../src/crud/read');
var update = require('../../src/crud/update');
var del = require('../../src/crud/delete');
var query = require('../../src/query/query');

describe('Update', function () {
  var type = 'teststore';
  var user = { key: 'testowner' };
  var tiger = { name: 'tiger', angry: false, tags: ['cat'] };

  before(done => {
    del.all(type).then(() => {
      return create.one(type, tiger, user).then(item => {
        expect(item.key).toExist();
        tiger.key = item.key;
        done();
      });
    });
  });

  it('should update one', done => {
    tiger.angry = true;
    tiger.tags.push('aggressive');
    update.one(type, tiger, user).then(() => {
      return read.one(type, tiger.key, user.key).then(result => {
        expect(result.angry).toBeTruthy();
      });
    }).then(() => {
      return query(type, { tag: 'aggressive' }).then(result => {
        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual(tiger.name);
      });
    }).then(() => {
      tiger.tags = ['passive'];
      return update.one(type, tiger, user);
    }).then(() => {
      return query(type, { tag: 'aggressive' }).then(result => {
        expect(result.length).toEqual(0);
      });
    }).then(() => {
      return query(type, { tag: 'passive' }).then(result => {
        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual(tiger.name);
        done();
      });
    })
  });
});
