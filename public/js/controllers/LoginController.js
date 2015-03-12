(function () {
    angular.module('myApp.controllers')
        .controller('LoginController',
        ['$scope', '$rootScope', 'AuthService', 'AUTH_EVENTS','$http', function ($scope, $rootScope, AuthService, AUTH_EVENTS, $http) {
            $scope.credentials = {
                username: '',
                password:''
            };

            $scope.login = login;
            $scope.logout = logout;
            $scope.test = test;
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

            function test(){
                $http.get('/api/admin/members/'+1).then(function success(res){
                    $scope.debug.test = res.data;
                }, function(err){
                    alert(JSON.stringify(err));
                })
            }

            function logout(){
                AuthService.logout();
            }

        }]);

})();