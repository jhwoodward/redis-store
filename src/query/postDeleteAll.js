var redis = require('redis');
var utils = require('../utils');
var removeParam = utils.removeParam;
var join = utils.join;

function postDeleteAll(type) {

  return new Promise((resolve, reject) => {

    var client = redis.createClient();
   
    var paramSet = join(type, 'param');
    client.smembers(paramSet, (err, sets) => {

      client.del(sets, (err, rep) => {
        if (!err) {
          client.del(paramSet, (err, rep) => {
            if (!err) {
              resolve();
            } else {
              reject();
            }
          });
        } else {
          reject(err);
        }
      });
    });
  });
}

module.exports = postDeleteAll;