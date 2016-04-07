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