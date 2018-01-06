var redis = require('redis');
var arrayDiff = require('simple-array-diff');
var utils = require('../utils');
var removeParam = utils.removeParam;
var addParam = utils.addParam;
var join = utils.join;

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
        removeParam(batch, type, 'tag', result.removed[i], itemKey);
      }
    }

    if (result.added.length) {
      for (var i = 0; i < result.added.length; i++) {
        addParam(batch, type, 'tag', result.added[i], itemKey);
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