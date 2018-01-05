var redis = require('redis');

/*

key1 = {a,b,c,d}
key2 = {c}
key3 = {a,c,e}
SINTER key1 key2 key3 = {c}
params = {
  user
  tag
  template
  forkedFrom
}

*/



function query(type, params) {
  var client = redis.createClient();

  var sets = [];
  for (var key in params) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].forEach(val => {
          sets.push(type + ':' + key + ':' + val);
        });
       
      } else {
        sets.push(type + ':' + key + ':' + params[key]);
      }
     
    }
  }

  return new Promise((resolve, reject) => {
    client.sinter(sets, function (err, rep) {
      if (!err) {
        resolve(rep);
      } else {
        reject(err);
      }
      client.quit();
    });
  });
}

module.exports = query;