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