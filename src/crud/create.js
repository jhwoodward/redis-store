var redis = require('redis');

function create(type, value) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();

    client.incr(type + 'key', function (err, key) {

      if (err) {
        reject(err);
        client.quit();
        return;
      }

      var multi = client.multi();
      if (value.tags && value.tags.length) {
        for (var i = 0; i < value.tags.length; i++) {
          multi.sadd(type + ':' + value.tags[i], key);
        }
      }

      multi.hset(type, key, JSON.stringify(value));
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

module.exports = create;