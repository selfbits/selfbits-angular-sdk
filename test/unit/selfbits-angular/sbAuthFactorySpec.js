'use strict';

describe('sbAuth Factory', function() {

	var $sbAuth;
	var $sbApiProvider;
	var $httpBackend;
	var $http;
	var $window;
	var $interval;
	var sbGuid;

	beforeEach(function() {
		module('selfbitsAngular', function(_$sbApiProvider_) {
			$sbApiProvider = _$sbApiProvider_;
		})
		inject(function(_$sbAuth_, _$httpBackend_, _$http_, _$window_, _$interval_, _sbGuid_) {
			$sbAuth = _$sbAuth_;
			$httpBackend = _$httpBackend_;
			$http = _$http_;
			$window = _$window_;
			$interval = _$interval_;
			sbGuid = _sbGuid_;
		});
		$sbApiProvider.appId = 'fancyId';
		$sbApiProvider.appSecret = 'fancySecret';
		$sbApiProvider.domain = 'http://www.test.de';
		return;
	});

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should load guid factory', function() {
		expect($sbAuth).to.be.ok;
	});

	it('should have Id and Secret set in Header', function() {
		expect($http.defaults.headers.common['SB-App-Id']).to.equal('fancyId');
		expect($http.defaults.headers.common['SB-App-Secret']).to.equal('fancySecret');
	});

	it('login() should allow login and exchange for JWT Token', function(done) {
		var user = {
			email: 'wasd@wasd.de',
			password: '1234'
		}
		$httpBackend.expect('POST', 'http://www.test.de/api/v1/auth/login', user).respond(200, {
			token: 'fancyToken'
		});

		$sbAuth.login(user).then(function(res) {
			expect($http.defaults.headers.common['Authorization']).to.equal('Bearer fancyToken');
			done();
		});
		$httpBackend.flush();
	});

	it('signup() should allow signup and exchange for JWT Token', function(done) {
		var user = {
			email: 'wasd@wasd.de',
			password: '1234'
		}
		$httpBackend.expect('POST', 'http://www.test.de/api/v1/auth/signup', user).respond(200, {
			token: 'fancyToken'
		});

		$sbAuth.signup(user).then(function(res) {
			expect($http.defaults.headers.common['Authorization']).to.equal('Bearer fancyToken');
			done();
		});
		$httpBackend.flush();
	});

	it('social() should allow social auth', function(done) {
		/* 
		 | this is a little tricky:
		 | - spy on guid generation, as we need the generated values for the http mock 
		 | - stub the window.open call and within that set closed property to true AND initialize mock with state guid
		*/
		var guidSpy = sinon.spy(sbGuid, 'gen');

		var windowStub = sinon.stub($window, 'open', function() {
			var genGuid = guidSpy.getCall(0).returnValue + guidSpy.getCall(1).returnValue;
			$httpBackend.expect('GET', 'http://www.test.de/api/v1/oauth/facebook/token?sb_app_id=fancyId&sb_app_secret=fancySecret&state=' + genGuid).respond(200, {
				token: 'fancyToken'
			});
			return {
				closed: true
			}
		});

		$sbAuth.social('facebook').then(function(res) {
			expect($http.defaults.headers.common['Authorization']).to.equal('Bearer fancyToken');
			done();
		});
		/* needs to be called AFTER $sbAuth.auth */
		$interval.flush(1000);
		$httpBackend.flush();
	});


	it('unlink() should allow to unlink a provider', function(done) {
		$httpBackend.expect('DELETE', 'http://www.test.de/api/v1/oauth/facebook/unlink').respond(200, {
			message: 'success'
		});

		$sbAuth.unlink('facebook').then(function(res) {
			expect(res.message).to.equal('success');
			done();
		});
		$httpBackend.flush();
	});

	it('password() should allow to change a password', function(done) {
		$httpBackend.expect('POST', 'http://www.test.de/api/v1/auth/password', { newPassword: 'new', oldPassword: 'old'}).respond(200, {
			message: 'success'
		});

		$sbAuth.password('new', 'old').then(function(res) {
			expect(res.message).to.equal('success');
			done();
		});
		$httpBackend.flush();
	});

	it('password() should allow to set a password', function(done) {
		$httpBackend.expect('POST', 'http://www.test.de/api/v1/auth/password', { newPassword: 'new' }).respond(200, {
			message: 'success'
		});

		$sbAuth.password('new').then(function(res) {
			expect(res.message).to.equal('success');
			done();
		});
		$httpBackend.flush();
	});

	it('logout() should remove HTTP header and token from localstorage', function(done) {
		$window.localStorage.setItem('sb_token', 'wasd');
		$http.defaults.headers.common['Authorization'] = 'Bearer wasd';

		$sbAuth.logout();
		expect($window.localStorage.getItem('sb_token')).to.be.null;
		expect($http.defaults.headers.common['Authorization']).to.be.undefined;
		done();
	});



});