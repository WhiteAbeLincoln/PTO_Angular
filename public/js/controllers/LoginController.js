(function () {
    angular.module('myApp.controllers')
        .controller('LoginController',
        ['$scope', '$rootScope', 'AuthService', 'AUTH_EVENTS','$http', function ($scope, $rootScope, AuthService, AUTH_EVENTS, $http) {
            $scope.updateTitle("Admin Login");
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
                    $scope.setCurrentUser(user);
                    $scope.debug.user = $scope.currentUser;
                }).catch(function(data, status, headers, config){
                    $scope.error = data;
                });
            }

            function test(){
                $http.get('/api/admin/members/'+1).success(function success(res){
                    $scope.debug.test = res;
                }).error(function(data, status, headers, config){
                    alert(JSON.stringify(data)+status);
                })
            }

            function logout(){
                AuthService.logout();
            }

        }]);

})();