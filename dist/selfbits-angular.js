(function(angular) {
	angular
		.module('selfbitsAngular', [
			'ngResource',
			'ngSanitize'
		])
		.run(function(sbConfig, $log, sbState) {
			if (!sbConfig.domain) {
				$log.error('Selfbits SDK: you MUST set $sbApiProvider.domain="yourDomain"');
			}
			if (!sbConfig.id) {
				$log.error('Selfbits SDK: you MUST set $sbApiProvider.appId="yourId"');
			}
			if (!sbConfig.id || !sbConfig.domain) {
				$log.error('If you don\'t have a Selfbits account yet, you can get one at http://baas.selfbits.org');
			}
			sbState.load();
		});
})(angular);
(function(angular) {
	angular
		.module('selfbitsAngular')
		.constant('sbConfig', {
			id: null,
			domain: null,
			secret: null
		});
})(angular);
(function(angular) {
	angular
		.module('selfbitsAngular')
		.provider('$sbApi', sbApiProvider);

		function sbApiProvider($httpProvider, sbConfig) {
			Object.defineProperties(this, {
				domain: {
					get: function() {
						return sbConfig.domain;
					},
					set: function(value) {
						sbConfig.domain = value;
					}
				},
				appId: {
					get: function() {
						return sbConfig.id;
					},
					set: function(value) {
						sbConfig.id = value;
						$httpProvider.defaults.headers.common['SB-App-Id'] = value;
					}
				},
				appSecret: {
					get: function() {
						return sbConfig.secret;
					},
					set: function(value) {
						sbConfig.secret = value;
						$httpProvider.defaults.headers.common['SB-App-Secret'] = value;
					}
				}
			});
			this.$get = function() {};
		}
})(angular);
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

(function(angular) {
	angular
		.module('selfbitsAngular')
		.factory('$sbDatabase', sbDatabase);

	function sbDatabase(sbConfig, $resource) {
		var sbDatabase = {
			table: table
		};

		function table(tableName) {
			return $resource(sbConfig.domain + '/api/v1/db/m/' + tableName + '/:_id', {
				_id: '@_id'
			});
		}
		return sbDatabase;
	}
})(angular);

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

(function(angular) {
    /* Implementation inspired by ngCordova Push */
    angular
        .module('selfbitsAngular')
        .factory('$sbFile', sbFile);

    function sbFile($http, $q, $window, $rootScope, $timeout, sbConfig, $log) {

        var sbFile = {
            upload: upload,
            initiateUpload: initiateUpload,
            executeUpload: executeUpload,
            verifyUpload: verifyUpload
        };

        /**
         * Upload a private file to the authorized user's folder.
         * @param params = {
         *          file: The file you want to upload,
         *          filePath: The destination path where you want to put the file. Default is the file name.
         *          permissionScope: 'user' = only the uploading user can access the file. '*': Every authenticated user can access the file if he has its fileId.
         *       }
         *
         */
        function upload(params) {
            var q = $q.defer();
            var file = params.file;
            var initiateUploadResponse = null;
            initiateUpload(params)
                .then(function(response) {
                    initiateUploadResponse = response;
                    return executeUpload(response.putFileUrl, file);
                })
                .then(function(etag) {
                    return verifyUpload(initiateUploadResponse.fileId, etag);
                })
                .then(function(verificationResponse) {
                    q.resolve(verificationResponse);
                })
                .catch(function(err) {
                    q.reject(err);
                });
            return q.promise;
        }

        function initiateUpload(params) {
            var q = $q.defer();
            if (!params || !params.file) {
                q.reject({
                    message: 'Upload initialization failed! Missing file param!'
                });
            } else {
                var file = params.file;
                var options = {
                    filePath: params.filePath || params.file.name,
                    permissionScope: params.permissionScope || 'user'
                };
                $http.post(sbConfig.domain + '/api/v1/file', options)
                    .then(function(res) {
                        q.resolve(res.data);
                    }, function(err) {
                        q.reject(err);
                    });
            }
            return q.promise;
        }

        function executeUpload(putUrl, file) {
            var q = $q.defer();
            if (putUrl && file) {
                $http({
                    method: 'PUT',
                    url: putUrl,
                    headers: {
                        'Content-Type': file.type ? file.type : 'application/octet-stream',
                        'Authorization': undefined,
                        'SB-App-Id': undefined,
                        'SB-App-Secret': undefined
                    },
                    data: file
                }).then(function(response) {
                    q.resolve(response.headers('ETag'));
                }, function(err) {
                    q.reject({
                        message: 'Upload failed! Please try again!'
                    });
                });
            } else {
                q.reject();
            }
            return q.promise;
        }

        function verifyUpload(fileId, etag) {
            var q = $q.defer();
            if (!fileId) {
                q.reject({
                    message: 'Upload verification failed! Missing fileId!'
                });
            } else if (!etag) {
                q.reject({
                    message: 'Upload verification failed! Missing etag!'
                });
            } else {
                var options = {
                    etag: etag
                };
                $http.post(sbConfig.domain + '/api/v1/file/' + fileId + '/verify', options)
                    .then(function(res) {
                        q.resolve(res.data);
                    }, function(err) {
                        q.reject(err);
                    });
            }
            return q.promise;
        }

        return sbFile;
    }

})(angular);

(function(angular) {
	angular
		.module('selfbitsAngular')
		.factory('sbGuid', sbGuid);

	function sbGuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}

		function gen() {
			return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
		}
		var sbGuid = {
			gen: gen
		};
		return sbGuid;
	}
})(angular);
(function(angular) {
    /* Implementation inspired by ngCordova Push */
    angular
        .module('selfbitsAngular')
        .factory('$sbPush', sbPush);

    function sbPush($http, $q, $window, $rootScope, $timeout, sbConfig, $log) {

        var sbPush = {
            push : null,
            pushRegistrationData : null,
            sync: sync,
            init: init,
            unregister: unregister,
            setBadgeNumber: setBadgeNumber
        };

        function sync() {
            if ($window.device && $window.PushNotification && sbPush.pushRegistrationData.registrationId) {
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

(function(angular) {
	angular
		.module('selfbitsAngular')
		.factory('sbState', sbState);

	function sbState($window, $http) {
		var sbState = {
			setToken: setToken,
			setUserId: setUserId,
			getToken: getToken,
			getUserId: getUserId,
			load: load,
			clear: clear,
		};

		function setToken(token) {
			if (token) {
				$window.localStorage.setItem('sb_token', token);
				$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
			}
		}

		function setUserId(userId) {
			if (userId) {
				$window.localStorage.setItem('userId', userId);
			}
		}

		function getUserId() {
			return $window.localStorage.getItem('userId');
		}

		function getToken() {
			return $window.localStorage.getItem('sb_token');
		}

		function load() {
			var token = $window.localStorage.getItem('sb_token');
			if (token) {
				$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
			}
		}

		function clear() {
			$http.defaults.headers.common['Authorization'] = undefined;
			$window.localStorage.clear();
		}

		return sbState;
	}
})(angular);
