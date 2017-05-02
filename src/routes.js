var router = require('express').Router();

require('./routes/create')(router);
require('./routes/read')(router);
require('./routes/update')(router);
require('./routes/delete')(router);

module.exports = router;
