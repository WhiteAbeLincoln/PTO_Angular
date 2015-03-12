(function () {
    angular.module('myApp.controllers')
        .controller('LoginController',
        ['$scope', '$rootScope', 'AuthService', 'AUTH_EVENTS', function ($scope, $rootScope, AuthService, AUTH_EVENTS) {
            $scope.credentials = {
                username: '',
                password:''
            };

            $scope.login = login;
            $scope.logout = logout;


            function login(username, password){
                AuthService.login(username, password).then(function(user){
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);
                }, function(){
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            }

            function logout(){
                UserFactory.logout();
            }

        }]);

})();