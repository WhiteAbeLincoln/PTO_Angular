/**
 * Created by abe on 3/11/15.
 */
(function () {
    angular.module('myApp')
        .service('Session', ['AuthTokenFactory', function(AuthTokenFactory){
            this.create = function (token, user) {
                AuthTokenFactory.setToken(token);
                AuthTokenFactory.setToken(JSON.stringify(user), 'user');
                this.userRole = user.role;
            };
            this.destroy = function () {
                AuthTokenFactory.dropToken();
                AuthTokenFactory.dropToken('user');
            };
            this.user = function() {
                return JSON.parse(AuthTokenFactory.getToken('user'));
            }
        }])
})();
