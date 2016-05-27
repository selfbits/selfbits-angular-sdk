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

	function sbAuth(sbConfig, sbState, $resource, $q, sbGuid, $http, $window, $interval) {
		var sbAuth = {
			social: social,
			unlink: unlink,
			login: login,
			signup: signup,
			logout: logout,
			password: password,
			isAuthenticated: isAuthenticated
		};

		function social(providerName) {
			var deferred = new $q.defer();
			var uniqueState = sbGuid.gen() + sbGuid.gen();
			var authWindow = $window.open(sbConfig.domain + '/api/v1/oauth/' + providerName + '?sb_app_id=' + sbConfig.id + '&sb_app_secret=' + sbConfig.secret + '&state=' + uniqueState, '_blank', 'height=700, width=500');
			var pingWindow = $interval(function() {
				if (authWindow.closed) {
					$http.get(sbConfig.domain + '/api/v1/oauth/' + providerName + '/token?sb_app_id=' + sbConfig.id + '&sb_app_secret=' + sbConfig.secret + '&state=' + uniqueState).then(function(res) {
						deferred.resolve(res.data);
						sbState.setToken(res.data.token);
					}, function(err) {
						deferred.reject(err);
					});
					$interval.cancel(pingWindow);
				}
			}, 1000);
			return deferred.promise;
		}

		function unlink(providerName) {
			var deferred = new $q.defer();
			$http.delete(sbConfig.domain + '/api/v1/oauth/' + providerName + '/unlink').then(function(res) {
				sbState.setToken(res.data.token);
				deferred.resolve(res.data);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		function password(newPassword, oldPassword) {
			var deferred = new $q.defer();
			$http.post(sbConfig.domain + '/api/v1/auth/password', { newPassword : newPassword, oldPassword : oldPassword}).then(function(res) {
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
				deferred.resolve(res.data);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		function signup(user) {
			var deferred = new $q.defer();
			$http.post(sbConfig.domain + '/api/v1/auth/signup', user).then(function(res) {
				sbState.setToken(res.data.token);
				deferred.resolve(res.data);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		function logout() {
			sbState.clear();
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
			return $resource(sbConfig.domain + '/api/v1/db/m/' + tableName + '/:itemId', {
				itemId: '@itemId'
			});
		}
		return sbDatabase;
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
	angular
		.module('selfbitsAngular')
		.factory('sbState', sbState);

	function sbState($window, $http) {
		var sbState = {
			setToken: setToken,
			getToken: getToken,
			load: load,
			clear: clear,
		};

		function setToken(token) {
			if (token) {
				$window.localStorage.setItem('sb_token', token);
				$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
			}
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