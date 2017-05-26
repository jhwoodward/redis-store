var config = require('./server.config');

module.exports = function (req, res, next) {
  var i, origin;
   // Cors allow
  if (req.headers.origin) {
    for (i = 0; i < config.origins.length; i++) {
      origin = config.origins[i];
      if (req.headers.origin.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        break;
      }
    }
  }
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS'){
      res.status(200).end();
  } else {
    // Pass to next layer of middleware
    next();
  }
};
