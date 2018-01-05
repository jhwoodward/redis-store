var redis = require('redis');

function paramValues(type, param) {
  var client = redis.createClient();

  return new Promise((resolve, reject) => {
    var set = type + ':' + param;
    client.smembers(set, function (err, rep) {
      if (!err) {
        resolve(rep);
      } else {
        reject(err);
      }
      client.quit();
    });
  });
}

module.exports = paramValues;