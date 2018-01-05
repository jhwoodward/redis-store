var redis = require('redis');
var arrayDiff = require('simple-array-diff');

function postUpdate(type, before, after) {

  return new Promise((resolve, reject) => {

    var itemKey = before.owner + ':' + before.key;
    var result = arrayDiff(before.tags, after.tags);

    if (!result.removed.length && !result.added.length) {
      resolve();
    }

    var client = redis.createClient();
    var batch = client.batch();

    if (result.removed.length) {
      for (var i = 0; i < result.removed.length; i++) {
        batch.srem(type + ':tag:' + result.removed[i], itemKey);
        batch.scard(type + ':tag:' + result.removed[i], (err, n) => {
          if (!n) {
            batch.srem(type + ':tag', result.removed[i]);
          }
        });
      }
    }

    if (result.added.length) {
      for (var i = 0; i < result.added.length; i++) {
        batch.sadd(type + ':tag:' + result.added[i], itemKey);
        batch.sadd(type + ':tag', result.added[i]);
      }
    }

    batch.exec(function (err, replies) {
      if (err) {
        reject(err);
        client.quit();
      } else {
        resolve(after);
        client.quit();
      }
    });
  });

}

module.exports = postUpdate;