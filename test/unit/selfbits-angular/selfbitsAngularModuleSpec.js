'use strict';

describe('selfbitsAngular Module', function() {

	var module;
	var dependencies;
	dependencies = [];
	var hasModule = function(module) {
		return dependencies.indexOf(module) >= 0;
	};

	beforeEach(function() {
		module = angular.module('selfbitsAngular');
		dependencies = module.requires;
	});

	it('should load selfbitsAngular module', function(done) {
		expect(module.name).to.equal('selfbitsAngular');
		done();
	});


});