var jwt = require('jsonwebtoken');
var config = require('../server.config');
var testusers = require('../testusers');
var create = require('../crud/create');
var read = require('../crud/read');

module.exports = router => {
  router.route('/user/login').post(function (req, res) {

    return read.one('user', req.body.key).then(user => {

      if (user.password === req.body.password) {
        var payload = { key: req.body.key };
        var token = jwt.sign(payload, config.jwt.secret);
        res.json({ user: user, token: token });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }

    }).catch(error => {
      if (error === 'not found') {
        res.status(401).json({ message: "User not found" });
      } else {
        res.status(500).json(error);
      }
    });

  });

  router.route('/user/signup').post(function (req, res) {
    var item = req.body;
    var type = 'user';
    create.one(type, item, item).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  router.route('/user/all').get(function (req, res) {
    read.all('user').then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  router.route('/user/one/:key').get(function (req, res) {
    read.one('user',req.params.key).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  router.route('/user/exists/:key').get(function (req, res) {
    read.one('user', req.params.key).then(result => {
      res.status(200).json({ exists: true });
    }).catch(error => {
      res.status(200).json({ exists: false });
    });
  });


}