var redis = require('redis');

function one(type, key) {
  var client = redis.createClient();

  return new Promise((resolve, reject) => {
    client.hget(type, key, function (err, rep) {
      if (!err) {
        if (rep !== null) {
          resolve(JSON.parse(rep));
        } else {
          reject('not found');
        }

      } else {
        reject(err);
      }
      client.quit();
    });
  });
}

function all(type) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    client.hgetall(type, function (err, rep) {
      if (!rep) {
        reject('not found');
        client.quit();
        return;
      }
      if (err) {
        reject(err);
        client.quit();
        return;
      }
      var out = [];
      for (var key in rep) {
        out.push({ key: key, value: JSON.parse(rep[key]) })
      }
      resolve(out);
      client.quit();
    });

  });
}

function list(type, tag) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();

    client.smembers(type + ':' + tag, function (err, keys) {
      if (!err) {
        if (keys && keys.length) {
          client.hmget(type, keys, function (err2, items) {
            if (err2) {
              reject(err2);
              return;
            }
            var out = [];
            for (var i = 0; i < items.length; i++) {
              var value = JSON.parse(items[i]);
              out.push(Object.assign(value, { key: keys[i] }));
            }
            resolve(out);
          });
        } else {
          resolve([]);
        }
      } else {
        reject(err);
      }
      client.quit();

    });
  });

}

module.exports = { one, all, list };
