/**
 * Created by abe on 3/19/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('AdminCtrl', ['$scope', 'AuthService', function($scope, AuthService){
            $scope.logout = function() {
                AuthService.logout();
            };

            $scope.debug = {user: $scope.currentUser};
        }])
})();
