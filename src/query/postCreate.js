var redis = require('redis');
var utils = require('../utils');
var addParam = utils.addParam;
var join = utils.join;

function postCreate(type, item) {

  return new Promise((resolve, reject) => {
    
    var itemKey = join(item.owner, item.key);
    var client = redis.createClient();
    var batch = client.batch();

    if (item.owner) {
      addParam(batch, type, 'owner', item.owner, itemKey);
    }

    if (item.tags && item.tags.length) {
      for (var i = 0; i < item.tags.length; i++) {
        addParam(batch, type, 'tag', item.tags[i], itemKey)
      }
    }

    if (item.forkedFrom) {
      var forkedFromKey = join(item.forkedFrom.owner, item.forkedFrom.key);
      addParam(batch, type, 'forkedFrom', forkedFromKey, itemKey);
    }

    if (item.template) {
      var templateKey = join(item.template.owner, item.template.key);
      addParam(batch, type, 'template', templateKey, itemKey);
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