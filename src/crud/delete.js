var redis = require('redis');

function del(type, key) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    client.hdel(type, key, function (err, rep) {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
      client.quit();
    });
  });

}
module.exports = del;