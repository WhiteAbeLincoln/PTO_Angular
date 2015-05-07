/**
 * Created by abe on 3/17/15.
 */
(function(){
    angular.module('myApp')
        .factory('FileReader', ['$q', function($q){
            var onLoad = function(reader, deferred, scope){
                return function() {
                    scope.$apply(function(){
                        deferred.resolve(reader.result);
                    });
                };
            };

            var onError = function (reader, deferred, scope) {
                return function(){
                    scope.$apply(function(){
                        deferred.reject(reader.result);
                    });
                };
            };

            var onProgress = function(reader, deferred, scope){
                return function (event) {
                    scope.$apply(function(){
                        deferred.notify(100 * (event.loaded/event.total));
                    });
                };
            };

            var getReader = function(deferred, scope){
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                reader.onprogress = onProgress(reader, deferred, scope);
                return reader;
            };

            function readAsDataURL (file, scope){
                var deferred = $q.defer();

                var reader = getReader(deferred, scope);
                reader.readAsDataURL(file);

                return deferred.promise;
            }

            return {
                readAsDataUrl: readAsDataURL
            }
        }])
        .factory('FileDownload', function(){
            //downloads a file from memory by creating a link with a data uri, clicking, and removing it
            /**
             * Downloads a file from memory
             * @param filename the desired filename
             * @param mime the mime type
             * @param text content of the downloaded file
             */
            function download(filename, mime, text) {
                var pom = document.createElement('a');
                pom.setAttribute('href', 'data:' + mime + ';charset=utf-8,' + encodeURIComponent(text));
                pom.setAttribute('download', filename);

                pom.style.display = 'none';
                document.body.appendChild(pom);

                pom.click();

                document.body.removeChild(pom);
            }

            return download;
        })
})();