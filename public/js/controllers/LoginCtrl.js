(function () {
    angular.module('myApp.controllers')
        .controller('LoginCtrl',
        ['$scope', '$rootScope', 'AuthService', 'AUTH_EVENTS','$http', '$location', function ($scope, $rootScope, AuthService, AUTH_EVENTS, $http, $location) {
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
                    $location.path('/admin');
                }).catch(function(data){
                    $scope.error = data;
                });
            }

            function test(){
                $http.get('/api/admin/members/'+1).success(function success(res){
                    $scope.debug.test = res;
                }).error(function(data, status, headers, config){
                    //alert(JSON.stringify(data)+status);
                });
            }

            function logout(){
                AuthService.logout();
            }

        }]);

})();