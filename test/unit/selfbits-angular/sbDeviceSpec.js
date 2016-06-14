'use strict';

describe('sbDevice Factory', function() {

    beforeEach(function() {
        var self = this;
        module('selfbitsAngular', function(_$sbApiProvider_) {
            self.$sbApiProvider = _$sbApiProvider_;
        })
        inject(function(_sbDevice_, _$httpBackend_, _$http_, _$window_, _$interval_, _sbGuid_) {
            self.sbDevice = _sbDevice_;
            self.$httpBackend = _$httpBackend_;
            self.$http = _$http_;
            self.$window = _$window_;
            self.$interval = _$interval_;
        });
        self.$sbApiProvider.appId = 'fancyId';
        self.$sbApiProvider.appSecret = 'fancySecret';
        self.$sbApiProvider.domain = 'http://www.test.de';
        return;
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });

    it('should load', function() {
        expect(this.sbDevice).to.be.ok;
    });

    it('should do nothing on sync if cordova is not present', function(done) {
        this.sbDevice.sync().then(function(res) {
            expect(res).to.be.undefined;
        });
        done();
    });

    it('should sync the device information to the backend if cordova is there', function() {
        // Fake preconditions for cordova
        this.$window.cordova = {};
        this.$window.device = {
            uuid: 12345,
            platform: 'iOS'
        };
        this.$httpBackend.expect('POST', 'http://www.test.de/api/v1/user/device', {
            uuid: 12345,
            platform: 'iOS'
        }).respond(200, {
            data: 'fancyData'
        });
        this.sbDevice.sync().then(function(res) {
            expect(res.data.data).to.equal('fancyData');
        });

        this.$httpBackend.flush();
    });
});
