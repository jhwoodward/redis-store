var redis = require('redis')
var join = require('../utils').join;
var postUpdate = require('../query/postUpdate');

function one(type, item, user) {

  if (!item.key) {
    throw new Error('Object must have a key property to update');
  }
  let itemKey = item.key;
  if (type !== 'user') {
    itemKey = user.key + ':' + itemKey; // keys are unique to users, not globally
  }

  return new Promise((resolve, reject) => {
    client = redis.createClient();

    client.hget(type, itemKey, function (err, rep) {

      if (!err) {
        var existing = JSON.parse(rep);

        client.hset(type, itemKey, JSON.stringify(item), (err2, replies) => {
          if (!err) {
            postUpdate(type, existing, item).then(resolve).catch(reject);
          } else {
            reject(err2);
          }
          client.quit();
        });
/*
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
              postUpdate(baseType, existing, item).then(resolve).catch(reject);
            } else {
              reject(err2);
            }
            client.quit();
          });

        });
*/
      } else {
        reject(err);
      }
    });
  });
}

module.exports = { one };

