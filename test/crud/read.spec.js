var expect = require('expect');
var del = require('../../src/crud/delete');
var read = require('../../src/crud/read');
var create = require('../../src/crud/create');

describe('Read', function () {
  var type = 'teststore';
  var user = { key: 'testowner' };
  var stuff = [
    { name: 'beer', tags: ['food', 'drink'] },
    { name: 'chips', tags: ['food'] },
    { name: 'wine', tags: ['drink'] }
  ];

  before(done => {
    del.all(type).then(() => {
      create.list(type, stuff, user).then(keys => {
        expect(keys.length).toEqual(3);
        done();
      });
    });
  });

  it('should read all', done => {
    read.all(type, user.key).then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(3);
      done();
    });
  });

  it('should read list', done => {
    read.list(type, ['testowner:' + stuff[0].key, 'testowner:' + stuff[1].key]).then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(2);
      done();
    });
  });

});
