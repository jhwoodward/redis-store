
  function join() {
    var args = Array.prototype.slice.call(arguments);
    return args.join(':');
  }
  function addParam(batch, type, param, key, value) {
    var valueSet = join(type, param, key);
    var keySet = join(type, param);
    var paramSet = join(type, 'param');

    batch.sadd(valueSet, value);
    batch.sadd(keySet, key);

    batch.sadd(paramSet, valueSet);
    batch.sadd(paramSet, keySet);
  }

  function removeParam(batch, type, param, key, value) {
    var valueSet = join(type, param, key);
    var keySet = join(type, param);
    var paramSet = join(type, 'param');
    batch.srem(valueSet, value);
    batch.scard(valueSet, (err, n) => {
      if (!n) {
        batch.srem(keySet, key);
        batch.srem(paramSet, valueSet);
        batch.scard(keySet, (err, m) => {
          if (!m) {
            batch.srem(paramSet, keySet);
          }
        });
      }
    });
  }


  module.exports = { join, addParam, removeParam }