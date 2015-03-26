/**
 * Created by 31160 on 3/11/2015.
 */
(function(){
    angular.module('myApp')
        .factory('AuthInterceptor', ['AuthTokenFactory', function AuthInterceptor(AuthTokenFactory){
            'use strict';
            return {
                request: addToken
            };

            function addToken(config){
                var token = AuthTokenFactory.getToken();
                if (token){
                    config.headers = config.headers || {};
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            }

        }])
        .factory('ErrorInterceptor', ['$q','$window', function($q, $window){
            return {
                responseError: function(rejection){
                    if (rejection.status){
                        if (rejection.config.method !== "POST"){

                            switch(rejection.status){
                                case 404:
                                    $window.location = rejection.config.url;
                                    break;
                                case 401:
                                    $window.location = rejection.config.url;
                                    break;
                                case 500:
                                    $window.location = rejection.config.url;
                                    break;
                            }

                            //$window.location = rejection.config.url;
                        }
                    }

                    return $q.reject(rejection);
                }
            }

        }])
})();