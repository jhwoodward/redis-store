var redis = require('redis');
var read = require('./read');
var utils = require('./utils');

function one(type, key) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();

    read.one(type, key)
      .then(item => { return utils.removeTags(item, key, type); } )
      .then(() => {
        client.hdel(type, key, (err, rep) => {
          if (!err) {
            resolve();
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

function all(type) {
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

module.exports = { one, all };
