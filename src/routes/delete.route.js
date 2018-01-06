var del = require('../crud/delete');

module.exports = (router, passport) => {

  router.route('/one/:type/:key').delete(passport.authenticate('jwt', { session: false }),function (req, res) {
    var type = req.params.type;// + ':' + req.user.key;
    var key = req.params.key;

    del.one(type, key, req.user).then(() => {
      res.status(200).send();
    }).catch(error => {
      res.status(500).json(error);
    });
  });
/*
  router.route('/all/:type').delete(passport.authenticate('jwt', { session: false }),function (req, res) {
    var type = req.params.type + ':' + req.user.key;
    del.all(type, req.user).then(() => {
      res.status(200).send();
    }).catch(error => {
      res.status(500).json(error);
    });
  });
*/

}
