var redis = require('redis')

function update(type, key, value) {
  return new Promise((resolve, reject) => {
    client = redis.createClient();
    var multi = client.multi();

    //update tags
    //get existing tags
    client.hget(type, key, function (err, rep) {

      if (!err) {
        var existing = JSON.parse(rep);
        if (existing.tags && existing.tags.length) {
          for (var i = 0; i < existing.tags.length; i++) {
            multi.srem(type + ':' + existing.tags[i], key);
          }
        }

        if (value.tags && value.tags.length) {
          for (var i = 0; i < value.tags.length; i++) {
            multi.sadd(type + ':' + value.tags[i], key);
          }
        }
        multi.hset(type, key, JSON.stringify(value));

        multi.exec(function (err2, replies) {
          if (!err) {
            resolve({ key });
          } else {
            reject(err2);
          }
          client.quit();
        });

      } else {
        reject(err);
      }
    });
  });
}

module.exports = update;

