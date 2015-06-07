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
            var gOpts = null;
            var gMime, gData, gFilename;



            function download() {
                var pom = document.createElement('a');
                var data;
                var charset = 'charset=utf-8';

                if (gOpts.type == 'arraybuffer') {
                    data = gData;
                    charset += ';base64';
                } else {
                    data = encodeURIComponent(gData)
                }

                pom.setAttribute('href', 'data:' + gMime + ';' + charset + ',' + data);
                console.log(pom.getAttribute('href'));
                pom.setAttribute('download', gFilename);

                pom.style.display = 'none';
                document.body.appendChild(pom);

                pom.click();

                document.body.removeChild(pom);

            }

            function atob(buffer){
                var binary = '';
                var bytes = new Uint8Array( buffer );
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode( bytes[ i ] );
                }
                return window.btoa( binary );
            }

            /**
             * Downloads a file from memory
             * @param data content of the downloaded file
             * @param options option object (required keys mime, filename)
             */
            function constructor(data, options) {
                gOpts = options;
                if (options.type == 'arraybuffer') {
                    gData = atob(data);
                } else {
                    gData = data;
                }
                gMime = options.mime;
                gFilename = options.filename;

                download();
            }

            return constructor;
        })
})();