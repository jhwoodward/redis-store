var redis = require('redis');

function one(type, key, userKey) {
  let itemKey = key;
  if (type !== 'user') {
    itemKey = userKey + ':' + key; // keys are unique to users, not globally
  }

  var client = redis.createClient();

  return new Promise((resolve, reject) => {
    client.hget(type, itemKey, function (err, rep) {
      if (!err) {
        if (rep !== null) {
          var item = JSON.parse(rep);
          item.key = key;
          resolve(item);
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

function list(type, keys) {

  return new Promise((resolve, reject) => {
    if (!keys.length) {
      resolve([]);
    }
    var client = redis.createClient();
    client.hmget(type, keys, function (err, items) {
      if (!err) {
        resolve(items.filter(item => !!item).map(item => JSON.parse(item)));
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
        resolve([]);
        client.quit();
        return;
      }
      if (err) {
        reject(err);
        client.quit();
        return;
      }
      var items = [];
      for (var key in rep) {
        var item = JSON.parse(rep[key]);
        item.key = key;
        items.push(item);
      }
      resolve(items);
      client.quit();
    });

  });
}
/*

function list(type, tag, userKey) {
  if (type !== 'user') {
    type += ':' + userKey; // keys are unique to users, not globally
  }
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
              if (value) {
                out.push(Object.assign(value, { key: keys[i] }));
              }
         
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

function tags(type, userKey) {
  type += ':' + userKey;
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    client.smembers('tags:' + type, function (err, tags) {
      if (!err) {
        resolve(tags);
      } else {
        reject(err);
      }
      client.quit();
    });
  });

}
*/
module.exports = { one, all, list };
