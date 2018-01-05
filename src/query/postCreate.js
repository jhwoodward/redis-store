var redis = require('redis');

function postCreate(type, item) {

  return new Promise((resolve, reject) => {
    
    var itemKey = item.owner + ':' + item.key;
    var client = redis.createClient();
    var batch = client.batch();

    if (item.owner) {
      batch.sadd(type + ':owner:' + item.owner, itemKey);
      batch.sadd(type + ':owner', item.owner);
    }

    if (item.tags && item.tags.length) {
      for (var i = 0; i < item.tags.length; i++) {
        batch.sadd(type + ':tag:' + item.tags[i], itemKey);
        batch.sadd(type + ':tag', item.tags[i]);
      }
    }

    if (item.forkedFrom) {
      var forkedFromKey = item.forkedFrom.owner + ':' + item.forkedFrom.key;
      batch.sadd(type + ':forkedFrom:' + forkedFromKey, itemKey);
      batch.sadd(type + ':forkedFrom', forkedFromKey);
    }

    if (item.template) {
      var templateKey = item.template.owner + ':' + item.template.key;
      batch.sadd(type + ':template:' + templateKey, itemKey);
      batch.sadd(type + ':template', templateKey);
    }

    batch.exec(function (err, replies) {
      if (err) {
        reject(err);
        client.quit();
      } else {
        resolve(item);
        client.quit();
      }
    });
  });
}

module.exports = postCreate;