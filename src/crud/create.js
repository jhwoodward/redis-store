var redis = require('redis');

function create(type, key, item) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    client.hget(type, key, function (err, rep) {
      if (rep) {
        reject('Item with key \'' + key + '\' already exists');
        client.quit();
        return;
      }
      var multi = client.multi();
      if (item.tags && item.tags.length) {
        for (var i = 0; i < item.tags.length; i++) {
          multi.sadd(type + ':' + item.tags[i], key);
          multi.sadd('tags:' + type, item.tags[i])
        }
      }
      multi.hset(type, key, JSON.stringify(item));
      multi.exec(function (err, replies) {
        if (err) {
          reject(err);
          client.quit();
        } else {
          resolve(key);
          client.quit();
        }
      });
    });
  });
}

function one(type, item) {
  return new Promise((resolve, reject) => {
    if (item.key) {
      create(type, item.key, item).then(resolve).catch(reject);
    } else {
      var client = redis.createClient();
      client.incr('key:' + type, (err, key) => {
        client.quit();
        create(type, key, item).then(resolve).catch(reject);
      });
    }
  });
}

function list(type, items) {
  var keys = [];
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    items.forEach(item => {
      if (item.key) {
        keys.push(item.key);
        create(type, item.key, item).then(checkComplete).catch(terminate);
      } else {
        client.incr('key:' + type, (err, key) => {
          keys.push(key);
          create(type, key, item).then(checkComplete).catch(terminate);
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
