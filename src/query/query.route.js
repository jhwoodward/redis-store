var query = require('./query');
var paramValues = require('./paramValues');


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

  router.route('/query/:type/values/:param').get(function (req, res) {
    var type = req.params.type;
    var param = req.params.param;
    paramValues(type, param).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

}