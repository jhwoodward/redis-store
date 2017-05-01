var expect = require('expect');
var del = require('../../src/crud/delete');
var read = require('../../src/crud/read');
var create = require('../../src/crud/create');

describe('Read', function () {
  var type = 'test';
  var values = [
    { name: 'test1', value: 'beer', tags: ['food', 'drink'] },
    { name: 'test2', value: 'chips', tags: ['food'] },
    { name: 'test3', value: 'wine', tags: ['drink'] }
  ];

  beforeEach(function (done) {
    del.all(type).then(() => {
      values.forEach((value, i) => {
        create.one(type, value).then(k => {
          expect(k).toExist();
          if (i === values.length - 1) {
            done();
          }
        });
      });
    })
  });

    it('should get all of type', function (done) {
      read.all(type).then(result => {
        expect(result).toExist();
        expect(result.length).toEqual(3);
        done();
      });
    });

    it('should get list by tag', function (done) {
      read.list(type, 'food').then(result => {
        expect(result).toExist();
        expect(result.length).toEqual(2);
        done();
      });
    });

});