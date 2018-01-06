var redis = require('redis');
var expect = require('expect');
var create = require('../../src/crud/create');
var read = require('../../src/crud/read');
var del = require('../../src/crud/delete');

describe('Create', function () {
  var type = 'teststore';
  var user = { key: 'testowner' };

  afterEach(done => {
    del.all(type).then(done);
  });

  it('should create one', done => {
    var albatross = { name: 'albatross', tags: ['bird'] };

    create.one(type, albatross, user).then(item => {
      expect(item).toExist();
      expect(item.key).toExist();
      expect(item.created).toExist();
      albatross = item;
      return item.key;
    }).then(key => {
      return read.one(type, key, user.key).then(result => {
        expect(result).toExist();
        expect(result.name).toEqual(albatross.name);
        done();
      });
    });
  });

  it('should create one with key', done => {
    var albatross = { key: 'albatross', name: 'albatross', tags: ['bird'] };

    create.one(type, albatross, user).then(item => {
      expect(item).toExist();
      expect(item.key).toEqual('albatross');
      expect(item.created).toExist();
      return item.key;
    }).then(key => {
      return read.one(type, key, user.key).then(result => {
        expect(result).toExist();
        expect(result.name).toEqual(albatross.name);
        done();
      });
    });
    
  });

    it('should throw error if key exists', done => {
      var albatross = { key: 'albatross', name: 'albatross', tags: ['bird'] };
      var gannet = { key: 'albatross', name: 'gannet', tags: ['bird'] };

      create.one(type, albatross, user).then(item => {
        expect(item).toExist();
        expect(item.key).toEqual('albatross');
        expect(item.created).toExist();
      }).then(() => {
        create.one(type, gannet).catch(err => {
          expect(err).toExist();
          done();
        });
      });
    });

  });