var expect = require('expect');
var del = require('../../src/crud/delete');
var query = require('../../src/query/query');
var create = require('../../src/crud/create');
var paramValues = require('../../src/query/paramValues');

describe('Query', function () {
  var type = 'teststore6';
  var owner1 = { key: 'testowner3' };
  var owner2 = { key: 'testowner4' };
  var template1 = { owner: 'abc', key: 'a' };
  var template2 = { owner: 'asdf', key: 'sds' };
  var forkedFrom1 = { owner: 'zzz', key: 'ax' };
  var owner1stuff = [
    {
      name: 'beer',
      tags: ['food', 'drink'],
      template: template1,

    },
    {
      name: 'chips',
      tags: ['food'],
      template: template1,
      forkedFrom: forkedFrom1
    },
    {
      name: 'wine',
      tags: ['drink'],
      forkedFrom: forkedFrom1
    }
  ];
  var owner2stuff = [
    {
      name: 'orange',
      tags: ['food'],
      template: template1,

    },
    {
      name: 'sausages',
      tags: ['food'],
      template: template2,
      forkedFrom: forkedFrom1
    },
    {
      name: 'water',
      tags: ['drink'],
      forkedFrom: forkedFrom1
    }
  ];

  before(done => {
    del.all(type).then(() => {
      create.list(type, owner1stuff, owner1).then(() => {
        create.list(type, owner2stuff, owner2).then(() => {
          done();
        });
      });
    });
  });

  it('should return food', done => {
    params = {
      tag: 'food'
    };
    query(type, params).then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(4);
      done();
    });
  });

  it('should only owner1\'s stuff', done => {
    params = {
      owner: owner1.key
    };
    query(type, params).then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(3);
      done();
    });
  });

  it('should load template stuff', done => {
    params = {
      template: template1.owner + ':' + template1.key
    };
    query(type, params).then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(3);
      done();
    });
  });

  it('should load forked from stuff', done => {
    params = {
      forkedFrom: forkedFrom1.owner + ':' + forkedFrom1.key
    };
    query(type, params).then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(4);
      done();
    });
  });

  it('should load forked template stuff', done => {
    params = {
      forkedFrom: forkedFrom1.owner + ':' + forkedFrom1.key,
      tag: 'food'
    };
    query(type, params).then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(2);
      done();
    });
  });

  it('should allow multiple tags', done => {
    params = {
      tag: ['food', 'drink']
    };
    query(type, params).then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(1);
      done();
    });
  });

  it('should return param values', done => {
    paramValues(type, 'tag').then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(2);
      done();
    });
  });

  it('should return param values', done => {
    paramValues(type, 'owner').then(result => {
      expect(result).toExist();
      expect(result.length).toEqual(2);
      done();
    });
  });

});
