'use strict';

describe('sbApi Factory', function() {

	var $sbApi;
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
		inject(function(_$sbApi_, _$httpBackend_, _$http_, _$window_, _$interval_, _sbGuid_) {
			$sbApi = _$sbApi_;
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
		expect($sbApi).to.be.ok;
	});

	it('should have Id and Secret set in Header', function() {
		expect($http.defaults.headers.common['SB-App-Id']).to.equal('fancyId');
		expect($http.defaults.headers.common['SB-App-Secret']).to.equal('fancySecret');
	});

	it('should allow login and exchange for JWT Token', function(done) {
		var user = {
			email: 'wasd@wasd.de',
			password: '1234'
		}
		$httpBackend.expect('POST', 'http://www.test.de/api/v1/auth/login', user).respond(200, {
			token: 'fancyToken'
		});

		$sbApi.login(user).then(function(res) {
			expect($http.defaults.headers.common['Authorization']).to.equal('Bearer fancyToken');
			done();
		});
		$httpBackend.flush();
	});

	it('should allow signup and exchange for JWT Token', function(done) {
		var user = {
			email: 'wasd@wasd.de',
			password: '1234'
		}
		$httpBackend.expect('POST', 'http://www.test.de/api/v1/auth/signup', user).respond(200, {
			token: 'fancyToken'
		});

		$sbApi.signup(user).then(function(res) {
			expect($http.defaults.headers.common['Authorization']).to.equal('Bearer fancyToken');
			done();
		});
		$httpBackend.flush();
	});

	it('should allow social auth', function(done) {
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

		$sbApi.auth('facebook').then(function(res) {
			expect($http.defaults.headers.common['Authorization']).to.equal('Bearer fancyToken');
			done();
		});
		/* needs to be called AFTER $sbApi.auth */
		$interval.flush(1000);
		$httpBackend.flush();
	});

});