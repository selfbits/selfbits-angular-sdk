'use strict';

describe('sbGuid', function() {

	var sbGuid;

	beforeEach(function() {
		module('selfbitsAngular')
		inject(function(_sbGuid_) {
			sbGuid = _sbGuid_;
		});
		return;
	});

	it('should load guid factory', function() {
		expect(sbGuid).to.be.ok;
	});

	it('should allow generate a guid String that has 32 digits', function(done) {
		var generated = sbGuid.gen();
		expect(generated).to.be.a('string');
		expect(generated.length).to.equal(32);
		done();
	});

	it('should generate unique guid Strings', function(done) {
		var generated_1 = sbGuid.gen();
		var generated_2 = sbGuid.gen();
		expect(generated_1).not.to.equal(generated_2);
		done();
	});

});