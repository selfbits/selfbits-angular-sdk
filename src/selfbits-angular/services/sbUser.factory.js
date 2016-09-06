(function(angular) {
    angular
        .module('selfbitsAngular')
        .factory('$sbUser', sbUser);

    function sbUser(sbConfig, $q, $window, $http) {
        var sbUser = {
            current: current
        };

        function current() {
            var q = new $q.defer();
            $http.get(sbConfig.domain + '/api/v1/user').then(function(res) {
                q.resolve(res);
            }, function(err) {
                q.reject(err);
            });
            return q.promise;
        }
        return sbUser;
    }
})(angular);
