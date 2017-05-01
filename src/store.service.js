module.exports = function (ngModule) {

  ngModule.factory("store", ['$http', function ($http) {

    var root = 'http://localhost:8080/api/';
    var type;

    function Store(type) {
      this.type = type;
    }

    Store.prototype = {
      save: function (key, item, cb) {
        var url = key ? root + 'store/' + this.type + '/' + key : root + 'store/' + this.type;
        $http({
          method: 'PUT',
          url: url,
          data: item,
        })
          .then(function (response) {
            if (cb) {
              console.log(response.data)
              cb(
                {
                  key: response.data.key,
                  value: item
                }
              );
            }
          }, function (response) {
            console.log('failed to save');
          });

      },
      delete: function (key, cb) {
        $http({
          method: 'DELETE',
          url: root + 'store/' + this.type + '/' + key
        }).then(function (response) {
          if (cb) {
            cb();
          }
        }, function (response) {
          console.log('failed to delete');
        });
      },
      getList: function (cb) {
        $http({
          method: 'GET',
          url: root + 'store/' + this.type + '/list'
        }).then(function (response) {
          cb(response.data);
        }, function (response) {
          console.log('failed to get list');
        });
      },
      getByTag: function (tag, cb) {

        $http({
          method: 'GET',
          url: root + 'store/' + this.type + '/tag/' + tag
        })
          .then(function (response) {

            cb(response.data);
          }, function (response) {
            console.log('failed to get list by tag');
          });

      },
      get: function (key, cb) {
        $http({
          method: 'GET',
          url: root + 'store/' + this.type + '/' + key
        })
          .then(function (response) {
            cb(response.data);
          }, function (response) {
            console.log('fail callback');
          });
      }
    };

    return {
      create: function (type) {
        var store = new Store(type);
        return store;
      }
    };

  }]);

};
