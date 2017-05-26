var update = require('../crud/update');

module.exports = (router, passport) => {
  router.route('/one/:type').put(passport.authenticate('jwt', { session: false }),function (req, res) {
    var item = req.body;
    var type = req.params.type ;
    var key = req.user.key;
    var listkey =  type + ':' + key;
    update.one(listkey, item, req.user).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  }); 
};
