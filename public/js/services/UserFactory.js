(function(){
    angular.module('myApp')
        .factory('UserFactory', ['$q', '$http', 'AuthTokenFactory',function UserFactory($q, $http, AuthTokenFactory){
            'use strict';
            return {
                login: login,
                logout: logout
            };

            function login(username, password){
                return $http.post('/api/admin/auth', {
                    username: username,
                    password: password
                }).then(function success(res){
                    AuthTokenFactory.setToken(res.data.token);
                    return res;
                });
            }

            function logout(){
                AuthTokenFactory.setToken();
            }
        }])
})();