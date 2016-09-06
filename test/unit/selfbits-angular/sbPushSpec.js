'use strict';

describe('sbPush Factory', function() {

    beforeEach(function() {
        var self = this;
        module('selfbitsAngular', function(_$sbApiProvider_) {
            self.$sbApiProvider = _$sbApiProvider_;
        })
        inject(function(_$sbPush_, _$httpBackend_, _$http_, _$window_, _$interval_, _sbGuid_) {
            self.$sbPush = _$sbPush_;
            self.$httpBackend = _$httpBackend_;
            self.$http = _$http_;
            self.$window = _$window_;
            self.$interval = _$interval_;
        });
        self.$sbApiProvider.appId = 'fancyId';
        self.$sbApiProvider.appSecret = 'fancySecret';
        self.$sbApiProvider.domain = 'http://www.test.de';

        // Stub for PushNotification
        self.$window.PushNotification = {
                init: function() {
                    return {
                        on: function() {
                            return;
                        }
                    };
                }
            }
            // Stub for device
        self.$window.device = {
            uuid: 1234588
        }
        return;
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });

    it('should load', function() {
        expect(this.$sbPush).to.be.ok;
    });

    it('should have Id and Secret set in Header', function() {
        expect(this.$http.defaults.headers.common['SB-App-Id']).to.equal('fancyId');
        expect(this.$http.defaults.headers.common['SB-App-Secret']).to.equal('fancySecret');
    });

    it('should allow to initialize the Push Service', function(done) {
        var spy = sinon.spy(this.$window.PushNotification, 'init');
        this.$sbPush.init();
        expect(spy.called).to.be.true;
        done();
    });

    it('should allow to sync the token with the backend', function(done) {
        this.$sbPush.pushRegistrationData = {
            registrationId: '1234'
        }
        this.$httpBackend.expect('POST', 'http://www.test.de/api/v1/user/device/notification', {
            'uuid': 1234588,
            'deviceToken': '1234'
        }).respond(200, {
            data: 'fancyData'
        });

        this.$sbPush.sync().then(function() {

				});
        this.$httpBackend.flush();
        done();
    });

});
