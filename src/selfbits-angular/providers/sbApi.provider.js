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