var del = require('../crud/delete');

module.exports = router => {

  router.route('/one/:type/:key').delete(function (req, res) {
    var type = req.params.type;
    var key = req.params.key;
    del.one(type, key).then(() => {
      res.status(200).send();
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  router.route('/all/:type').delete(function (req, res) {
    var type = req.params.type;
    del.all(type).then(() => {
      res.status(200).send();
    }).catch(error => {
      res.status(500).json(error);
    });
  });


}
