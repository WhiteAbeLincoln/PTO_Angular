/**
 * Created by abe on 5/5/15.
 */
(function (angular) {
    angular.module('myApp.controllers')
        .controller('AdminRegisterCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
            $scope.updateTitle("Register Administrator");

            $scope.user = {
                'firstName': null,
                'lastName':null,
                'email':null,
                'type':null,
                'username':null,
                'password':null
            };
            $scope.userError = {};

            $scope.$watch('user.username', function(newVal, oldVal) {
               if (!angular.equals(newVal, oldVal)) {
                   $http.head('/api/admin/user/' + newVal).then(function(res) {
                       $scope.userError.user = !(res.status === 404);
                   }, function(err) {
                       $scope.userError.user = !(err.status === 404);
                   })
               }
            });

            $scope.submit = function(){
                if ($scope.error.strength) {
                    return;
                }

                $http.post('/api/admin/register', $scope.user).then(function(data){
                    $window.location = '#/admin'
                }).catch(function(err){
                    alert(JSON.stringify(err));
                })
            };


        }])

})(window.angular);
