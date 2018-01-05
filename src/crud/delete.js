var redis = require('redis');
var read = require('./read');
var utils = require('./utils');
var postDelete = require('../query/postDelete');

function one(type, key, user) {
  var baseType = type;
  type += ':' + user.key; // keys are unique to users, not globally
  var existing;
  return new Promise((resolve, reject) => {
    var client = redis.createClient();

    read.one(baseType, key, user)
      .then(item => {
        return utils.removeTags(item, key, type);
      }).then(item => {
        client.hdel(type, key, (err, rep) => {
          if (!err) {
            postDelete(baseType, item).then(resolve).catch(reject);
          } else {
            reject(err);
          }
          client.quit();
        });
      }).catch(err => {
        reject(err);
      });
  });
}

function all(type, user) {

  return new Promise((resolve, reject) => {
    read.all(type, user).then(items => {

      if (!items.length) {
        resolve();
        return;
      }

      var count = 0;

      items.forEach(item => {
        one(type, item.key, user).then(() => {
          count ++;
          if (count === items.length) {
            resolve();
          }
        }).catch(reject);
      });

    }).catch(reject);

  });


}
/*
function all(type, user) {
  type += ':' + user.key; // keys are unique to users, not globally
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    var multi = client.multi();
    multi.del(type);
    multi.del('key:' + type);
    multi.smembers('tags:' + type, removeTags);

    function removeTags(err, tags) {
      tags.forEach(tag => {
        client.del(type + ':' + tag);
      });
      client.del('tags:' + type);
    }

    multi.exec(function (err, rep) {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
      client.quit();
    });

  });
}
*/

module.exports = { one, all };
