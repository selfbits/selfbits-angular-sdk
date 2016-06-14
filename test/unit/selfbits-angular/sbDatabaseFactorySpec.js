'use strict';

describe('sbDatabase Factory', function() {

    beforeEach(function() {
        var self = this;
        module('selfbitsAngular', function(_$sbApiProvider_) {
            self.$sbApiProvider = _$sbApiProvider_;
        })
        inject(function(_$sbDatabase_, _$httpBackend_, _$http_, _$window_, _$interval_, _sbGuid_) {
            self.$sbDatabase = _$sbDatabase_;
            self.$httpBackend = _$httpBackend_;
            self.$http = _$http_;
            self.$window = _$window_;
            self.$interval = _$interval_;
            self.sbGuid = _sbGuid_;
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
        expect(this.$sbDatabase).to.be.ok;
    });

    it('should have Id and Secret set in Header', function() {
        expect(this.$http.defaults.headers.common['SB-App-Id']).to.equal('fancyId');
        expect(this.$http.defaults.headers.common['SB-App-Secret']).to.equal('fancySecret');
    });

    it('should allow to query a table', function() {
        this.$httpBackend.expect('GET', 'http://www.test.de/api/v1/db/m/test').respond(200, {
            data: 'fancyData'
        });
        var testResult = this.$sbDatabase.table('test').get();
        this.$httpBackend.flush();
        expect(testResult.data).to.equal('fancyData');
    });

    it('should allow to query a specific object', function() {
        this.$httpBackend.expect('GET', 'http://www.test.de/api/v1/db/m/test/1234').respond(200, {
            data: 'fancyData'
        });
        var testResult = this.$sbDatabase.table('test').get({
            _id: 1234
        });
        this.$httpBackend.flush();
        expect(testResult.data).to.equal('fancyData');
    });

    it('should allow to query a specific object with query params', function() {
        this.$httpBackend.expect('GET', 'http://www.test.de/api/v1/db/m/test/1234?deep=true&filter=%7B%22occupation%22:%22host%22,%22age%22:%7B%22$gt%22:17,%22$lt%22:66%7D,%22likes%22:%7B%22$in%22:%5B%22vaporizing%22,%22talking%22%5D%7D%7D&meta=true').respond(200, {
            data: 'fancyData'
        });
        var testResult = this.$sbDatabase.table('test').get({
            _id: 1234,
            meta: true,
            deep: true,
            filter: {
                occupation: 'host',
                age: {
                    $gt: 17,
                    $lt: 66
                },
                likes: {
                    $in: ['vaporizing', 'talking']
                }
            }
        });
        this.$httpBackend.flush();
        expect(testResult.data).to.equal('fancyData');
    });

});
