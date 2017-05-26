var router = require('express').Router();

module.exports = function(passport) {
  require('./routes/user.route')(router, passport);
  require('./routes/create.route')(router, passport);
  require('./routes/read.route')(router, passport);
  require('./routes/update.route')(router, passport);
  require('./routes/delete.route')(router, passport);
  return router;
};


