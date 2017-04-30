module.exports = function (ngModule) {
  require('./gallery.service')(ngModule);
  require('./store.service')(ngModule);
};