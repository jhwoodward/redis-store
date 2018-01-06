var redis = require('redis');
var postCreate = require('../query/postCreate');
var join = require('../utils').join;

function create(type, item, user) {
  let itemKey = item.key;

  if (type !== 'user') {
    itemKey = join(user.key, item.key); // keys are unique to users, not globally
  }
  
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    client.hexists(type, itemKey, function (err, rep) {
      if (rep) {
        reject('Item with key \'' + itemKey + '\' already exists');
        client.quit();
        return;
      }
      item.created = new Date().getTime();
      item.owner = user.key;

      client.hset(type, itemKey, JSON.stringify(item), (err, res) => {
        if (err) {
          reject(err);
          client.quit();
        } else {
          postCreate(type, item).then(resolve).catch(reject);
          client.quit();
        }
      });
    });
  });
}

function one(type, item, user) {
  return new Promise((resolve, reject) => {
    if (item.key) {
      create(type, item, user).then(resolve).catch(reject);
    } else {
      var client = redis.createClient();
      client.incr(join(type, 'key'), (err, key) => {
        client.quit();
        item.key = key;
        create(type, item, user).then(resolve).catch(reject);
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
