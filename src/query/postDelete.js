var redis = require('redis');
var utils = require('../utils');
var removeParam = utils.removeParam;
var join = utils.join;

function postDelete(type, item) {

  return new Promise((resolve, reject) => {

    var itemKey = join(item.owner, item.key);
    var client = redis.createClient();
    var batch = client.batch();

    if (item.owner) {
      removeParam(batch, type, 'owner', item.owner, itemKey);
    }

    if (item.tags && item.tags.length) {
      for (var i = 0; i < item.tags.length; i++) {
        removeParam(batch, type, 'tag', item.tags[i], itemKey);
      }
    } 

    if (item.forkedFrom) {
      var forkedFromKey = join(item.forkedFrom.owner, item.forkedFrom.key);
      removeParam(batch, type, 'forkedFrom', forkedFromKey, itemKey);
    }

    if (item.template) {
      var templateKey = join(item.template.owner, item.template.key);
      removeParam(batch, type, 'template', templateKey, itemKey);
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