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
            $scope.debug = {user: $scope.currentUser};


            function login(creds){
                AuthService.login(creds.username, creds.password).then(function(user){
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);
                    $scope.debug.user = $scope.currentUser;
                }, function(){
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            }

            function logout(){
                AuthService.logout();
            }

        }]);

})();