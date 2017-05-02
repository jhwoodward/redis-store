var redis = require('redis')
var utils = require('./utils');

function one(type, itemWithKey) {
  return new Promise((resolve, reject) => {
    client = redis.createClient();

    var key = itemWithKey.key;
    if (!key) {
      throw new Error('Object must have a key property to update');
    }
    var item = Object.assign({}, itemWithKey);
    delete item.key;

    //update tags
    //get existing tags
    client.hget(type, key, function (err, rep) {

      if (!err) {
        var existing = JSON.parse(rep);

        utils.removeTags(existing, key, type).then(() => {
          var multi = client.multi();

          if (item.tags && item.tags.length) {
            for (var i = 0; i < item.tags.length; i++) {
              multi.sadd(type + ':' + item.tags[i], key);
              multi.sadd('tags:' + type, item.tags[i])
            }
          }

          multi.hset(type, key, JSON.stringify(item));

          multi.exec(function (err2, replies) {
            if (!err) {
              resolve();
            } else {
              reject(err2);
            }
            client.quit();
          });

        });

      } else {
        reject(err);
      }
    });
  });
}

module.exports = { one };

