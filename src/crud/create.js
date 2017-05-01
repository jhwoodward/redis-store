var redis = require('redis');

function create(type, key, value, multi) {
  if (value.tags && value.tags.length) {
    for (var i = 0; i < value.tags.length; i++) {
      multi.sadd(type + ':' + value.tags[i], key);
      multi.sadd('tags:' + type, value.tags[i])
    }
  }
  multi.hset(type, key, JSON.stringify(value));
}
// TODO: if key present in incoming object, try to create the object with the given key and error out if key exists
function one(type, value) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();

    client.incr('key:' + type, (err, key) => {
      var multi = client.multi();
      create(type, key, value, multi);
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

function list(type, values) {
  var keys = [];
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    values.forEach(value => {

      client.incr('key:' + type, (err, key) => {
        keys.push(key);
        var multi = client.multi();
        create(type, key, value, multi);
        multi.exec(function (err, replies) {
          if (err) {
            reject(err);
          } else {
            if (keys.length === values.length) {
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