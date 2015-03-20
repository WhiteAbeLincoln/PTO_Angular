/**
 * Created by 31160 on 3/11/2015.
 */
(function(){
    angular.module('myApp')
        .factory('AuthTokenFactory', ['$window',function AuthTokenFactory($window){
            var store = $window.localStorage;
            var key = 'auth-token';

            return{
                getToken: getToken,
                setToken: setToken,
                dropToken: dropToken
            };

            function getToken(ky){
                if (ky){
                    return store.getItem(ky);
                } else {
                    return store.getItem(key);
                }
            }

            function setToken(token, ky){
                if (token && ky){
                    store.setItem(ky, token);
                } else if (token) {
                    store.setItem(key, token);
                }
            }

            function dropToken(ky){
                if (ky){
                    store.removeItem(ky);
                } else {
                    store.removeItem(key);
                }
            }
        }]);
})();