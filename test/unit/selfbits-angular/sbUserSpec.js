'use strict';

describe('sbUser Factory', function() {

    beforeEach(function() {
        var self = this;
        module('selfbitsAngular', function(_$sbApiProvider_) {
            self.$sbApiProvider = _$sbApiProvider_;
        })
        inject(function(_$sbUser_, _$httpBackend_, _$http_, _$window_, _$interval_) {
            self.$sbUser = _$sbUser_;
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
        expect(this.$sbUser).to.be.ok;
    });

});
