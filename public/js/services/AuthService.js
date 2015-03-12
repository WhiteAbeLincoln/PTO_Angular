/**
 * Created by abe on 3/11/15.
 */
(function () {
    angular.module('myApp')
        .factory('AuthService', ['$q', '$http', 'Session', function($q, $http, Session){
            var authService = {};

            authService.login = function(username, password){
                return $http.post('/api/admin/login', {
                    username: username,
                    password: password
                }).then(function success(res){
                    Session.create(res.data.token, res.data.user);
                    return res.data.user;
                });
            };

            authService.logout = function(){
                Session.destroy();
            };

            authService.isAuthenticated = function(){
                return !!Session.user;        //coerces to boolean
            };

            authService.isAuthorized = function(roles){
                if (!angular.isArray(roles)) {
                    roles = [roles];
                }
                return $http.get('/api/admin/auth/'+ Session.user.id)
                    .then(function(res){
                        return roles.indexOf(res.role) !== -1;
                    }).error(function(data, status, headers, config){
                        if (status === 401){
                            return false;
                        }
                    });
            };

            return authService;
        }])
})();
