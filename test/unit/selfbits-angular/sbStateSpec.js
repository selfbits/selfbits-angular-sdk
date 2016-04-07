'use strict';

describe('sbState', function() {


	beforeEach(function() {
		var self = this;
		module('selfbitsAngular')
		inject(function(_sbState_, _$window_, _$http_) {
			self.sbState = _sbState_;
			self.$window = _$window_;
			self.$http = _$http_;
		});


	});
	afterEach(function() {
		/* reset */
		this.$window.localStorage.clear();
		this.$http.defaults.headers.common['Authorization'] = undefined;
	});

	it('should load sbState factory', function() {
		expect(this.sbState).to.be.ok;
	});

	it('setToken() should allow to set a token', function(done) {
		/* run function */
		this.sbState.setToken('abcdefd');
		/* check */
		expect(this.$http.defaults.headers.common['Authorization']).to.equal('Bearer abcdefd');
		expect(this.$window.localStorage.getItem('sb_token')).to.equal('abcdefd');
		done();
	});
	it('setToken() should not set a token on "undefined"', function(done) {
		/* run function */
		this.sbState.setToken(undefined);
		/* check */
		expect(this.$http.defaults.headers.common['Authorization']).to.be.undefined;
		expect(this.$window.localStorage.getItem('sb_token')).to.be.null;
		done();
	});
	it('getToken() should return the token', function(done) {
		this.$window.localStorage.setItem('sb_token', 'wasd');
		/* run function/check */
		expect(this.sbState.getToken()).to.equal('wasd');
		done();
	});
	it('clear() should remove the token from localstorage and $http', function(done) {
		this.$http.defaults.headers.common['Authorization'] = "Bearer qwertz";
		this.$window.localStorage.setItem('sb_token', 'qwertz');
		/* run function */
		this.sbState.clear();
		/* check */
		expect(this.$http.defaults.headers.common['Authorization']).to.be.undefined;
		expect(this.$window.localStorage.getItem('sb_token')).to.be.null;
		done();
	});
	it('load() should set the token if it exists', function(done) {
		this.$window.localStorage.setItem('sb_token', 'qwertz');
		this.sbState.load();
		expect(this.$http.defaults.headers.common['Authorization']).to.equal('Bearer qwertz');
		done();
	});


});