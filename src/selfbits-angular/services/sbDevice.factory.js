(function(angular) {
    angular
        .module('selfbitsAngular')
        .factory('sbDevice', sbDevice);

    function sbDevice(sbConfig, $q, $window, $http) {
        var sbDevice = {
            sync: sync
        };

        function sync() {
            var deferred = new $q.defer();
            if ($window.cordova && $window.device) {
                $http.post(sbConfig.domain + '/api/v1/user/device', $window.device).then(function(res) {
                    deferred.resolve(res);
                }, function(err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }
        return sbDevice;
    }
})(angular);
