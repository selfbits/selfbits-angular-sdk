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