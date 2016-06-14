(function(angular) {
    angular
        .module('selfbitsAngular')
        .factory('$sbAuth', sbAuth);

    function sbAuth(sbConfig, sbState, $resource, $q, sbGuid, $http, $window, $interval, $timeout, sbDevice) {
        var sbAuth = {
            social: social,
            unlink: unlink,
            login: login,
            signup: signup,
            logout: logout,
            password: password,
            getUserId: getUserId,
            isAuthenticated: isAuthenticated
        };

        function social(providerName) {
            var deferred = new $q.defer();
            var uniqueState = sbGuid.gen() + sbGuid.gen();
            var popupUrl = sbConfig.domain + '/api/v1/oauth/' + providerName + '?sb_app_id=' + sbConfig.id + '&sb_app_secret=' + sbConfig.secret + '&state=' + uniqueState;
            var authWindow;

            if ($window.cordova && $window.cordova.InAppBrowser) {
                authWindow = $window.cordova.InAppBrowser.open(popupUrl, '_blank', 'location=no');
                authWindow.addEventListener('loadstop', function(event) {
                    if (event.url.indexOf(providerName + '/callback') > -1) {
                        authWindow.close();
                    }
                });
                authWindow.addEventListener('loaderror', function(event) {
                    if (event.url.indexOf(providerName + '/callback') > -1) {
                        authWindow.close();
                    }
                });
                authWindow.addEventListener('exit', function() {
                    $timeout(function() {
                        getToken(providerName, uniqueState).then(function(res) {
                            sbState.setToken(res.data.token);
                            sbState.setUserId(res.data.userId);
                            sbDevice.sync().then(function() {
                                deferred.resolve(res.data);
                            }, function(err) {
                                deferred.reject(err);
                            });
                        }, function(err) {
                            deferred.reject(err);
                        });
                    }, 500);
                });
            } else {
                authWindow = $window.open(popupUrl, '_blank', 'height=700, width=500');
                var pingWindow = $interval(function() {
                    if (authWindow.closed) {
                        getToken(providerName, uniqueState).then(function(res) {
                            sbState.setUserId(res.data.userId);
                            sbState.setToken(res.data.token);
                            deferred.resolve(res.data);
                        }, function(err) {
                            deferred.reject(err);
                        });
                        $interval.cancel(pingWindow);
                    }
                }, 1000);
            }
            return deferred.promise;
        }

        function getToken(providerName, uniqueState) {
            return $http.get(sbConfig.domain + '/api/v1/oauth/' + providerName + '/token?sb_app_id=' + sbConfig.id + '&sb_app_secret=' + sbConfig.secret + '&state=' + uniqueState);
        }

        function unlink(providerName) {
            var deferred = new $q.defer();
            $http.delete(sbConfig.domain + '/api/v1/oauth/' + providerName + '/unlink').then(function(res) {
                deferred.resolve(res.data);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function password(newPassword, oldPassword) {
            var deferred = new $q.defer();
            $http.post(sbConfig.domain + '/api/v1/auth/password', {
                newPassword: newPassword,
                oldPassword: oldPassword
            }).then(function(res) {
                deferred.resolve(res.data);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function login(user) {
            var deferred = new $q.defer();
            $http.post(sbConfig.domain + '/api/v1/auth/login', user).then(function(res) {
                sbState.setToken(res.data.token);
                sbState.setUserId(res.data.userId);
                sbDevice.sync().then(function() {
                    deferred.resolve(res.data);
                }, function(err) {
                    deferred.reject(err);
                });
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function signup(user) {
            var deferred = new $q.defer();
            $http.post(sbConfig.domain + '/api/v1/auth/signup', user).then(function(res) {
                sbState.setToken(res.data.token);
                sbState.setUserId(res.data.userId);
                sbDevice.sync().then(function() {
                    deferred.resolve(res.data);
                }, function(err) {
                    deferred.reject(err);
                });
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function logout() {
            sbState.clear();
        }

        function getUserId() {
            return sbState.getUserId();
        }

        function isAuthenticated() {
            return (sbState.getToken() !== null);
        }
        return sbAuth;
    }
})(angular);
