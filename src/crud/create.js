var redis = require('redis');
var postCreate = require('../query/postCreate');

function create(type, item, user) {
  type += ':' + user.key; // keys are unique to users, not globally
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    client.hget(type, item.key, function (err, rep) {
      if (rep) {
        reject('Item with key \'' + item.key + '\' already exists');
        client.quit();
        return;
      }
      item.created = new Date().getTime();
      item.owner = user.key;
      var multi = client.multi();
      if (item.tags && item.tags.length) {
        for (var i = 0; i < item.tags.length; i++) {
          multi.sadd(type + ':' + item.tags[i], item.key);
          multi.sadd('tags:' + type, item.tags[i])
        }
      }
      multi.hset(type, item.key, JSON.stringify(item));
      multi.exec(function (err, replies) {
        if (err) {
          reject(err);
          client.quit();
        } else {
          resolve(item);
          client.quit();
        }
      });
    });
  });
}

function one(type, item, user) {
  return new Promise((resolve, reject) => {
    if (item.key) {
      create(type, item, user).then(() => {
        postCreate(type, item).then(resolve).catch(reject);
      }).catch(reject);
    } else {
      var client = redis.createClient();
      client.incr('key:' + type, (err, key) => {
        client.quit();
        item.key = key;
        create(type, item, user).then(() => {
          postCreate(type, item).then(resolve).catch(reject);
        }).catch(reject);
      });
    }

  });
}

function list(type, items, user) {
  var keys = [];
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    items.forEach(item => {
      if (item.key) {
        keys.push(item.key);
        create(type, item, user).then(checkComplete).catch(terminate);
      } else {
        client.incr('key:' + type, (err, key) => {
          keys.push(key);
          item.key = key;
          create(type, item, user).then(checkComplete).catch(terminate);
        });
      }
      function checkComplete() {
        if (keys.length === items.length) {
          resolve(keys);
          client.quit();
        }
      }
      function terminate(err) {
        reject(err);
        client.quit();
      }
    });
  });
}

module.exports = { one, list };
