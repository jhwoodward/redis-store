var config = require('./server.config');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var testusers = require('./testusers');
var read = require('./crud/read');

var jwtOptions = {}
jwtOptions.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = config.jwt.secret;
var strategy = new passportJWT.Strategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);

  read.one('user', jwt_payload.key).then(user => {
     next(null, user);
  })
  .catch(err => {
     next(null, false);
  });

});
passport.use(strategy);
module.exports = passport;