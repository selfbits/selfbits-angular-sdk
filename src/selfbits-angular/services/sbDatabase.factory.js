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