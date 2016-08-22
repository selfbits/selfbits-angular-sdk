(function(angular) {
    /* Implementation inspired by ngCordova Push */
    angular
        .module('selfbitsAngular')
        .factory('$sbPush', sbPush);

    function sbPush($http, $q, $window, $rootScope, $timeout, sbConfig, $log) {

        var sbPush = {
            push: null,
            pushRegistrationData: null,
            sync: sync,
            init: init,
            unregister: unregister,
            setBadgeNumber: setBadgeNumber
        };

        function sync() {
            if ($window.device && $window.device.uuid && $window.PushNotification &&
                sbPush.pushRegistrationData && sbPush.pushRegistrationData.registrationId) {
                return $http.post(sbConfig.domain + '/api/v1/user/device/notification', {
                    uuid: $window.device.uuid,
                    deviceToken: sbPush.pushRegistrationData.registrationId
                });
            } else {
                return;
            }
        }

        function init(config) {
            if ($window.PushNotification) {
                sbPush.push = $window.PushNotification.init(config);
                sbPush.push.on('registration', function(data) {
                    sbPush.pushRegistrationData = data;
                });
                sbPush.push.on('notification', function(data) {
                    $rootScope.$broadcast('pushNotificationReceived', data);
                });
                sbPush.push.on('error', function(err) {
                    $log.log(err);
                });
            }
        }

        function unregister(options) {
            var q = $q.defer();
            $window.PushNotification.unregister(function(result) {
                q.resolve(result);
            }, function(error) {
                q.reject(error);
            }, options);

            return q.promise;
        }

        // iOS only
        function setBadgeNumber(number) {
            var q = $q.defer();
            $window.PushNotification.setApplicationIconBadgeNumber(function(result) {
                q.resolve(result);
            }, function(error) {
                q.reject(error);
            }, number);
            return q.promise;
        }

        return sbPush;
    }

})(angular);
