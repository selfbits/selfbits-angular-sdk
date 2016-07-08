'use strict';

describe('sbFile Factory', function() {

    beforeEach(function() {
        var self = this;
        module('selfbitsAngular', function(_$sbApiProvider_) {
            self.$sbApiProvider = _$sbApiProvider_;
        })
        inject(function(_$sbFile_, _$httpBackend_, _$http_, _$window_, _$interval_) {
            self.$sbFile = _$sbFile_;
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
        expect(this.$sbFile).to.be.ok;
    });

    it('should have Id and Secret set in Header', function() {
        expect(this.$http.defaults.headers.common['SB-App-Id']).to.equal('fancyId');
        expect(this.$http.defaults.headers.common['SB-App-Secret']).to.equal('fancySecret');
    });

    it('should allow to upload a file', function() {
        this.$httpBackend.expect('POST', 'http://www.test.de/api/v1/file').respond(200, {
            putFileUrl: 'http://www.testupload.de',
            fileId: '1234'
        });
        this.$httpBackend.expect('PUT', 'http://www.testupload.de').respond(200, {}, {
            ETag: '\"abc12\"'
        });
        this.$httpBackend.expect('POST', 'http://www.test.de/api/v1/file/1234/verify').respond(200, {
            key: 'fancyValue'
        });
        var params = {
            file: "file",
            filePath: 'myFile.txt'
        };
        this.$sbFile.upload(params).then(function(result) {
            expect(result.key).to.equal('fancyValue');
        });
        this.$httpBackend.flush();
    });

    it('should allow to initiate file upload', function() {
        this.$httpBackend.expect('POST', 'http://www.test.de/api/v1/file').respond(200, {
            key: 'fancyValue'
        });

        var params = {
            file: "file",
            filePath: 'myFile.txt'
        }
        this.$sbFile.initiateUpload(params).then(function(result) {
            expect(result.key).to.equal('fancyValue');
        });
        this.$httpBackend.flush();
    });

    it('should allow to execute file upload', function() {
        this.$httpBackend.expect('PUT', 'http://www.testupload.de').respond(200, {}, {
            ETag: '\"abc123\"'
        });
        this.$sbFile.executeUpload('http://www.testupload.de', 'myfile').then(function(result) {
            expect(result.headers('ETag')).to.equal('\"abc123\"');
        });
        this.$httpBackend.flush();
    });

    it('should allow to verify file upload', function() {
        this.$httpBackend.expect('POST', 'http://www.test.de/api/v1/file/1234/verify').respond(200, {
            key: 'fancyValue'
        });
        this.$sbFile.verifyUpload('1234', '\"abc123\"').then(function(result) {
            expect(result.key).to.equal('fancyValue');
        });
        this.$httpBackend.flush();
    });


    it('should allow to query a specific file', function() {
        this.$httpBackend.expect('GET', 'http://www.test.de/api/v1/file/1234?expiresInSeconds=60').respond(200, {
            data: 'fancyData'
        });
        var params = {
            fileId: '1234',
            expiresInSeconds: 60
        };
        var testResult = this.$sbFile.get(params).then(function(result) {
            expect(result.data).to.equal('fancyData');
        });
        this.$httpBackend.flush();
    });

    /*
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
        }); */

});
