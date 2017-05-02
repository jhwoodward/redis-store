var redis = require('redis');

function create(type, key, item, multi) {
  if (item.tags && item.tags.length) {
    for (var i = 0; i < item.tags.length; i++) {
      multi.sadd(type + ':' + item.tags[i], key);
      multi.sadd('tags:' + type, item.tags[i])
    }
  }
  multi.hset(type, key, JSON.stringify(item));
}
// TODO: if key present in incoming object, try to create the object with the given key and error out if key exists
function one(type, item) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();

    client.incr('key:' + type, (err, key) => {
      var multi = client.multi();
      create(type, key, item, multi);
      multi.exec(function (err, replies) {
        if (err) {
          reject(err);
        } else {
          resolve(key);
        }
        client.quit();
      });
    });
  });
}

function list(type, items) {
  var keys = [];
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    items.forEach(item => {

      client.incr('key:' + type, (err, key) => {
        keys.push(key);
        var multi = client.multi();
        create(type, key, item, multi);
        multi.exec(function (err, replies) {
          if (err) {
            reject(err);
          } else {
            if (keys.length === items.length) {
              resolve(keys);
              client.quit();
            }
          }
        });
      });
    });

  });
}

module.exports = { one, list };