var read = require('../crud/read');

module.exports = (router, passport) => {

  //get one by type / user / key 
  router.route('/one/:type/:user/:key').get(function (req, res) {
    var type = req.params.type;
    var user = req.params.user;
    if (user !== 'anon' && user !== 'tutorial') {
      type += ':' + user;
    }
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

  //get all of given type / user
  router.route('/all/:type/:user').get(function (req, res) {
    var type = req.params.type;
    var user = req.params.user;
    if (user !== 'anon' && user !== 'tutorial') {
      type += ':' + user;
    }
    read.all(type).then(result => {
      result = result.map(item => {
        return {
          key: item.key,
          name: item.name, 
          description: item.description, 
          created: item.created,
          owner: item.owner
        };
      })
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  //get by tag
  router.route('/list/:type/:user/:tag').get(function (req, res) {
    var type = req.params.type;
    var user = req.params.user;
    if (user !== 'anon' && user !== 'tutorial') {
      type += ':' + user;
    }
    var tag = req.params.tag;
    read.list(type, tag).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

  //get tags
  router.route('/tags/:type/:user').get(function (req, res) {
    var type = req.params.type;
    var user = req.params.user;
    if (user !== 'anon' && user !== 'tutorial') {
      type += ':' + user;
    }
    read.tags(type).then(result => {
      res.status(200).json(result);
    }).catch(error => {
      res.status(500).json(error);
    });
  });

};
