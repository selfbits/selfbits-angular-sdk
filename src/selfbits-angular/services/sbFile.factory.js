(function(angular) {
    /* Implementation inspired by ngCordova Push */
    angular
        .module('selfbitsAngular')
        .factory('$sbFile', sbFile);

    function sbFile($http, $q, $window, $rootScope, $timeout, sbConfig, $log) {

        var sbFile = {
            upload: upload,
            initiateUpload: initiateUpload,
            executeUpload: executeUpload,
            verifyUpload: verifyUpload
        };

        /**
         * Upload a private file to the authorized user's folder.
         * @param params = {
         *          file: The file you want to upload,
         *          filePath: The destination path where you want to put the file. Default is the file name.
         *          permissionScope: 'user' = only the uploading user can access the file. '*': Every authenticated user can access the file if he has its fileId.
         *       }
         *
         */
        function upload(params) {
            var q = $q.defer();
            var file = params.file;
            var initiateUploadResponse = null;
            initiateUpload(params)
                .then(function(response) {
                    initiateUploadResponse = response;
                    return executeUpload(response.putFileUrl, file);
                })
                .then(function(etag) {
                    return verifyUpload(initiateUploadResponse.fileId, etag);
                })
                .then(function(verificationResponse) {
                    q.resolve(verificationResponse);
                })
                .catch(function(err) {
                    q.reject(err);
                });
            return q.promise;
        }

        function initiateUpload(params) {
            var q = $q.defer();
            if (!params || !params.file) {
                q.reject({
                    message: 'Upload initialization failed! Missing file param!'
                });
            } else {
                var file = params.file;
                var options = {
                    filePath: params.filePath || params.file.name,
                    permissionScope: params.permissionScope || 'user'
                };
                $http.post(sbConfig.domain + '/api/v1/file', options)
                    .then(function(res) {
                        q.resolve(res.data);
                    }, function(err) {
                        q.reject(err);
                    });
            }
            return q.promise;
        }

        function executeUpload(putUrl, file) {
            var q = $q.defer();
            if (putUrl && file) {
                $http({
                    method: 'PUT',
                    url: putUrl,
                    headers: {
                        'Content-Type': file.type ? file.type : 'application/octet-stream',
                        'Authorization': undefined,
                        'SB-App-Id': undefined,
                        'SB-App-Secret': undefined
                    },
                    data: file
                }).then(function(response) {
                    q.resolve(response.headers('ETag'));
                }, function(err) {
                    q.reject({
                        message: 'Upload failed! Please try again!'
                    });
                });
            } else {
                q.reject();
            }
            return q.promise;
        }

        function verifyUpload(fileId, etag) {
            var q = $q.defer();
            if (!fileId) {
                q.reject({
                    message: 'Upload verification failed! Missing fileId!'
                });
            } else if (!etag) {
                q.reject({
                    message: 'Upload verification failed! Missing etag!'
                });
            } else {
                var options = {
                    etag: etag
                };
                $http.post(sbConfig.domain + '/api/v1/file/' + fileId + '/verify', options)
                    .then(function(res) {
                        q.resolve(res.data);
                    }, function(err) {
                        q.reject(err);
                    });
            }
            return q.promise;
        }

        return sbFile;
    }

})(angular);
