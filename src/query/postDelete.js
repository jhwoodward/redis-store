var redis = require('redis');

function postDelete(type, item) {

  return new Promise((resolve, reject) => {

    var itemKey = item.owner + ':' + item.key;
    var client = redis.createClient();
    var batch = client.batch();

    if (item.owner) {
      batch.srem(type + ':owner:' + item.owner, itemKey);
      batch.scard(type + ':owner:' + item.owner, (err, n) => {
        if (!n) {
          batch.srem(type + ':owner', item.owner);
        }
      });
    }

    if (item.tags && item.tags.length) {
      for (var i = 0; i < item.tags.length; i++) {
        batch.srem(type + ':tag:' + item.tags[i], itemKey);
        batch.scard(type + ':tag:' + item.tags[i], (err, n) => {
          if (!n) {
            batch.srem(type + ':tag', item.tags[i]);
          }
        });
      }
    }

    if (item.forkedFrom) {
      var forkedFromKey = item.forkedFrom.owner + ':' + item.forkedFrom.key;
      batch.srem(type + ':forkedFrom:' + forkedFromKey, itemKey);
      batch.scard(type + ':forkedFrom:' + forkedFromKey, (err, n) => {
        if (!n) {
          batch.srem(type + ':forkedFrom', forkedFromKey);
        }
      });
    }

    if (item.template) {
      var templateKey = item.template.owner + ':' + item.template.key;
      batch.srem(type + ':template:' + templateKey, itemKey);
      batch.scard(type + ':template:' + templateKey, (err, n) => {
        if (!n) {
          batch.srem(type + ':tempate', templateKey);
        }
      });
    }

    batch.exec(function (err, replies) {
      if (err) {
        reject(err);
        client.quit();
      } else {
        resolve();
        client.quit();
      }
    });
  });
}

module.exports = postDelete;