var update = require('../crud/update');

module.exports = router => {
  router.route('/one/:type').put(function (req, res) {
    var item = req.body;
    var type = req.params.type;
    update.one(type, item).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  }); 
};
