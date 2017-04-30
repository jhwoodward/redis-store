var router = require('express').Router();
var create = require('./crud/create');
var del = require('./crud/delete');
var read = require('./crud/read');
var update = require('./crud/update');

//create
router.route('/crud/:type').post(function (req, res) {
  var value = req.body;
  var type = req.params.type;
  create(type, value).then(result => {
    res.status(200).json(result);
  }).catch(error => {
    res.status(500).json(error);
  });
});

//read
//get one by type / key 
router.route('/crud/:type/:key').get(function (req, res) {
  var type = req.params.type;
  var key = req.params.key;

  read.getOne(type, key).then(result => {
    res.status(200).json(result);
  }).catch(error => {
    if (error === 'not found') {
      res.status(404).json(error);
    } else {
      res.status(500).json(error);
    }
   
  });
});

//get list (all of given type)
router.route('/crud/:type/list').get(function (req, res) {
  var type = req.params.type;

  read.getList(type).then(result => {
    res.status(200).json(result);
  }).catch(error => {
    res.status(500).json(error);
  });
});

//get by tag
router.route('/crud/:type/tagged/:tagname').get(function (req, res) {
  var type = req.params.type;
  var tagname = req.params.tagname;
  read.getByTag(type, key).then(result => {
    res.status(200).json(result);
  }).catch(error => {
    res.status(500).json(error);
  });
});

//update
router.route('/crud/:type/:key').put(function (req, res) {
  var key = req.params.key;
  var value = req.body;
  var type = req.params.type;
  update(type, key, value).then(result => {
    res.status(200).json(result);
  }).catch(error => {
    res.status(500).json(error);
  });
});

//delete
router.route('/crud/:type/:key').delete(function (req, res) {
  var type = req.params.type;
  var key = req.params.key;
  del(type, key).then(() => {
    res.status(200).send();
  }).catch(error => {
    res.status(500).json(error);
  });
});

module.exports = router;
