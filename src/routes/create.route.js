var create = require('../crud/create');

module.exports = (router, passport) => {
  router.route('/one/:type').post(passport.authenticate('jwt', { session: false }),function (req, res) {
    var item = req.body;
    var type = req.params.type;// + ':' + req.user.key;
    create.one(type, item, req.user).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  router.route('/list/:type').post(passport.authenticate('jwt', { session: false }),function (req, res) {
    var items = req.body;
    var type = req.params.type;// + ':' + req.user.key;
    create.list(type, items, req.user).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

};

