'use strict';

describe('sbApiProvider', function() {

	beforeEach(function() {
		var self = this;
		module('selfbitsAngular', function(_$sbApiProvider_, _sbConfig_) {
			self.$sbApiProvider = _$sbApiProvider_;
			self.sbConfig = _sbConfig_;
		})
		inject();
		return;
	});

	it('should load provider', function(done) {
		expect(this.$sbApiProvider).to.be.ok;
		done();
	});

	it('should allow to set app id', function(done) {
		this.$sbApiProvider.appId = '1234';
		expect(this.$sbApiProvider.appId).to.equal('1234');
		expect(this.sbConfig.id).to.equal('1234');
		this.$sbApiProvider.appId = null;
		done();
	});

	it('should allow to set app secret', function(done) {
		this.$sbApiProvider.appSecret = '4321';
		expect(this.$sbApiProvider.appSecret).to.equal('4321');
		expect(this.sbConfig.secret).to.equal('4321');
		this.$sbApiProvider.appSecret = null;
		done();
	});

	it('should set app secret to null instead of empty string', function(done) {
		this.$sbApiProvider.appSecret = '';
		expect(this.$sbApiProvider.appSecret).to.equal(null);
		expect(this.sbConfig.secret).to.equal(null);
		this.$sbApiProvider.appSecret = null;
		done();
	});

	it('should allow to set app domain', function(done) {
		this.$sbApiProvider.domain = 'http://test.de';
		expect(this.$sbApiProvider.domain).to.equal('http://test.de');
		expect(this.sbConfig.domain).to.equal('http://test.de');
		this.$sbApiProvider.domain = null;
		done();
	});
});
