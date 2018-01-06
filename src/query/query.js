var redis = require('redis');
var read = require('../crud/read');
var join = require('../utils').join;
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
          sets.push(join(type, key, val));
        });
       
      } else {
        sets.push(join(type, key, params[key]));
      }
     
    }
  }

  return new Promise((resolve, reject) => {
    client.sinter(sets, function (err, keys) {
      if (!err) {
        read.list(type, keys).then(items => {
          resolve(items);
        }).catch(reject);
        /*
        rep.forEach(ownerkey => {
          var owner = ownerkey.split(':')[0];
          var key = ownerkey.split(':')[1];
       
          read.one(type, key, owner).then(item => {
            //maybe trim the item first ?
            items.push(item);
            if (items.length === rep.length) {
              resolve(items);
            }
          }).catch(reject);
        });*/

      } else {
        reject(err);
      }
      client.quit();
    });
  });
}

module.exports = query;