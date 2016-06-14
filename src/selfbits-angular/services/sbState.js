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
