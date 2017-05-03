var create = require('../crud/create');

module.exports = router => {
  router.route('/one/:type').post(function (req, res) {
    var item = req.body;
    var type = req.params.type;
    create.one(type, item).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  router.route('/list/:type').post(function (req, res) {
    var items = req.body;
    var type = req.params.type;
    create.list(type, items).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

};
