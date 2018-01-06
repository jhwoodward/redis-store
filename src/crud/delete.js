var redis = require('redis');
var read = require('./read');
//var utils = require('./utils');
var postDelete = require('../query/postDelete');
var postDeleteAll = require('../query/postDeleteAll');

function one(type, key, user) {
  const userKey = user.key || user;
  let itemKey = key;
  if (type !== 'user') {
    itemKey = userKey + ':' + itemKey; // keys are unique to users, not globally
  }

  return new Promise((resolve, reject) => {
    var client = redis.createClient();

    read.one(type, key, userKey).then(item => {

      client.hdel(type, itemKey, (err, rep) => {
        client.quit();
        if (err) {
          reject(err);
          return;
        }
        if (rep > 0) {
          postDelete(type, item).then(resolve).catch(reject);
        } 
      });

    }).catch(reject);

  });
}


//caution !!!
function all(type) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    client.del(type, (err, rep) => {
      if (!err) {
        if (rep > 0) {
          postDeleteAll(type).then(resolve).catch(reject);
        } else {
          resolve();
        }
      } else {
        reject();
      }
    });
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
