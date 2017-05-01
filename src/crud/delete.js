var redis = require('redis');
var read = require('./read');

function one(type, key) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();

    read.one(type, key).then(result => {
      return new Promise((resolve, reject) => {
        if (!result.tags) return;
        var multi = client.multi();
        result.tags.forEach((tag, i) => {
          client.srem(type + ':' + tag, key, (err, rep) => {
            //any left?
            if (err) {
              reject(err);
              return;
            }
            client.smembers(type + ':' + tag, (err, rep) => {
              if (rep.length === 0) {
                client.srem('tags:' + type, tag, (err, rep) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  if (i === result.tags.length - 1) {
                    resolve();
                  }
                });
              } else {
                if (i === result.tags.length - 1) {
                  resolve();
                }
              }

            });
          });
        });
      }).then(() => {
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
        client.del(tag);
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
