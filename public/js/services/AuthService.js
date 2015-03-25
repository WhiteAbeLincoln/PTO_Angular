/**
 * Created by abe on 3/11/15.
 */
(function () {
    angular.module('myApp')     //Not sure why I need Session anymore
        .factory('AuthService', ['$q', '$http', 'Session', 'AuthTokenFactory','$window', function($q, $http, Session, AuthTokenFactory, $window){
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

            authService.getUser = function(){
                if (AuthTokenFactory.getToken()){
                    return $http.get('/api/admin/me');
                } else {
                    return $q.reject({data: 'client has no auth token'});
                }
            };

            authService.logout = function(){
                console.log('GoGoRangers');
                Session.destroy();
                $window.location.reload();
            };

            authService.isAuthenticated = function(){
                return !!Session.user;        //coerces to boolean
            };

            authService.isAuthorized = function(roles){
                if (!angular.isArray(roles)) {
                    roles = [roles];
                }
                return $http.get('/api/admin/user/'+ Session.user.id)
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