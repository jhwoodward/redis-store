var redis = require('redis');

var api = {

  removeTags: (item, key, type) => {
    var client = redis.createClient();
    return new Promise((resolve, reject) => {
      if (!item.tags) {
        resolve();
      }
      item.tags.forEach((tag, i) => {
        client.srem(type + ':' + tag, key, (err, rep) => {
          //any left?
          if (err) {
            client.quit();
            reject(err);
            return;
          }
          client.smembers(type + ':' + tag, (err, rep) => {
            if (rep.length === 0) {
              client.srem('tags:' + type, tag, (err, rep) => {
                if (err) {
                  client.quit();
                  reject(err);
                  return;
                }
                if (i === item.tags.length - 1) {
                  client.quit();
                  resolve();
                }
              });
            } else {
              if (i === item.tags.length - 1) {
                client.quit();
                resolve();
              }
            }
          });
        });
      });
    })
  }
};

module.exports = api;