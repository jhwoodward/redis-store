var router = require('express').Router();

require('./routes/create.route')(router);
require('./routes/read.route')(router);
require('./routes/update.route')(router);
require('./routes/delete.route')(router);

module.exports = router;
