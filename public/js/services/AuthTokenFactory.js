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
                setToken: setToken
            };

            function getToken(){
                console.log('got token');
                return store.getItem(key);
            }

            function setToken(token){
                if (token){
                    store.setItem(key, token);
                } else {
                    store.removeItem(key);
                }
            }
        }]);
})();