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
        }]);
})();