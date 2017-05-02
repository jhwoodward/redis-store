var read = require('../crud/read');

module.exports = router => {
  //get one by type / key 
  router.route('/one/:type/:key').get(function (req, res) {
    var type = req.params.type;
    var key = req.params.key;

    read.one(type, key).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      if (error === 'not found') {
        res.status(404).json(error);
      } else {
        res.status(500).json(error);
      }
    });
  });

  //get all of given type
  router.route('/all/:type').get(function (req, res) {
    var type = req.params.type;
    read.all(type).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  //get by tag
  router.route('/list/:type/:tag').get(function (req, res) {
    var type = req.params.type;
    var tag = req.params.tag;
    read.list(type, tag).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  //get tags
  router.route('/tags/:type').get(function (req, res) {
    var type = req.params.type;
    read.tags(type).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

};
