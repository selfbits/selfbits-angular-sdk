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