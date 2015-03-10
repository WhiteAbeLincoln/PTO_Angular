/**
 * Created by abe on 3/8/15.
 */
(function(){
    angular.module('myApp')
        .factory('AuthService', ['$http', 'Session', function($http, Session){
            var authService = {};

            authService.login = function(credentials){
                return $http
                    .post('api/login', credentials)
                    .then(function(res){
                        Session.create(res.data.id, res.data.user.id, res.data.user.role);
                        return res.data.user;
                    });
            };

            authService.isAuthenticated = function(){
                return !!Session.userId;        //coerces Session.userId to boolean
            };

            authService.isAuthorized = function(roles){
                if (!angular.isArray(roles)){
                    roles = [roles];
                }
                return (authService.isAuthenticated() &&
                    roles.indexOf(Session.userRole) !== -1);
            };

            return authService;
        }])
})();