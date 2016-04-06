(function(angular) {
	angular
		.module('selfbitsAngular', [
			'ngResource',
			'ngSanitize'
		])
		.run(function(sbConfig, $log) {
			if (!sbConfig.domain) {
				$log.error('Selfbits SDK: you MUST set $sbApiProvider.domain="yourDomain"');
			}
			if (!sbConfig.id) {
				$log.error('Selfbits SDK: you MUST set $sbApiProvider.appId="yourId"');
			}
			if (!sbConfig.id || !sbConfig.domain) {
				$log.error('If you don\'t have a Selfbits account yet, you can get one at http://baas.selfbits.org');
			}
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
			this.$get = sbApi;

			function sbApi($q, $http, $interval, sbGuid, $window, $resource, sbConfig) {
				var $sbApi = {
					auth : auth,
					login: login,
					signup: signup,
					unlink: unlink
				};
				function auth(providerName) {
					var deferred = new $q.defer();
					var uniqueState = sbGuid.gen() + sbGuid.gen();
					var authWindow = $window.open(sbConfig.domain + '/api/v1/oauth/' + providerName + '?sb_app_id=' + sbConfig.id + '&sb_app_secret=' + sbConfig.secret + '&state=' + uniqueState, '_blank', 'height=700, width=500');
					var pingWindow = $interval(function() {
						if (authWindow.closed) {
							$http.get(sbConfig.domain + '/api/v1/oauth/' + providerName + '/token?sb_app_id=' + sbConfig.id + '&sb_app_secret=' + sbConfig.secret + '&state=' + uniqueState).then(function(res) {
								deferred.resolve(res.data);
								$http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
							});
							$interval.cancel(pingWindow);
						}
					}, 1000);
					return deferred.promise;
				}

				function login(user) {
					var deferred = new $q.defer();
					$http.post(sbConfig.domain + '/api/v1/auth/login', user).then(function(res) {
						$http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
						deferred.resolve(res.data);
					}, function(err) {
						deferred.reject(err);
					});
					return deferred.promise;
				}

				function signup(user) {
					var deferred = new $q.defer();
					$http.post(sbConfig.domain + '/api/v1/auth/signup', user).then(function(res) {
						$http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
						deferred.resolve(res.data);
					}, function(err) {
						deferred.reject(err);
					});
					return deferred.promise;
				}

				function unlink(user) {
					var deferred = new $q.defer();
					$http.post(sbConfig.domain + '/auth/signup?sb_app_id=' + sbConfig.id + '&sb_app_secret=' + sbConfig.secret, user).then(function(res) {
						$http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
						deferred.resolve(res.data);
					}, function(err) {
						deferred.reject(err);
					});
					return deferred.promise;
				}

				return $sbApi;
			}

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
			return $resource(sbConfig.domain + '/api/v1/database/' + tableName + '/:itemId', {
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