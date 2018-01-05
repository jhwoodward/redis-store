var query = require('./query');

module.exports = (router, passport) => {

  router.route('/query/:type').post(function (req, res) {
    var params = req.body;
    var type = req.params.type;
    query(type, params).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

}