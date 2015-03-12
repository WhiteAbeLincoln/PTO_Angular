/**
 * Created by abe on 3/11/15.
 */
(function () {
    angular.module('myApp')
        .service('Session', ['AuthTokenFactory', function(AuthTokenFactory){
            this.create = function (token, user) {
                AuthTokenFactory.setToken(token);
                this.user = user;
                this.userRole = user.role;
            };
            this.destroy = function () {
                AuthTokenFactory.setToken();
                this.userId = null;
                this.userRole = null;
            };
        }])
})();
