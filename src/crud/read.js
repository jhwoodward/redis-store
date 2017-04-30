var redis = require('redis');

function getOne(type, key) {
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

function getList(type) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();
    client.hgetall(type, function (err, rep) {
      if (!err) {
        var out = [];
        for (var key in rep) {
          out.push({ key: key, value: JSON.parse(rep[key]) })
        }
        resolve(out);
      } else {
        reject(err);
      }
      client.quit();
    });

  });
}

function getByTag(type, tag) {
  return new Promise((resolve, reject) => {
    var client = redis.createClient();

    client.smembers(type + ':' + tag, function (err, rep) {
      if (!err) {
        if (rep && rep.length) {
          client.hmget(type, rep, function (err2, rep2) {
            var out = [];
            for (var i = 0; i < rep2.length; i++) {
              out.push({ key: rep[i], value: JSON.parse(rep2[i]) })
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

module.exports = { getOne, getList, getByTag };
