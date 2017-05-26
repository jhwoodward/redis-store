var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var config = require('./server.config');



// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('./headers'));
var passport = require('./passport');
app.use(passport.initialize());

//configure routes
app.use('/', require('./routes')(passport));

var port = process.env.PORT || config.port;

app.listen(port);
console.log('Magic happens on port ' + port);