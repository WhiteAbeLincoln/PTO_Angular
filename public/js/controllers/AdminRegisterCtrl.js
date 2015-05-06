/**
 * Created by abe on 5/5/15.
 */
(function () {
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

            $scope.debug = {user: $scope.currentUser};
            $scope.strengthError = {};

            $scope.pwChange = function(password){
                $scope.nbvcxz = zxcvbn(password);

                $scope.pwStyle = {'background-color':'#f44336', 'width': (($scope.nbvcxz.score+1) / 5) * 100 + '%', 'height': '2px'};
                if ($scope.nbvcxz.score == 0)
                    $scope.strengthError.strength = true;
                if ($scope.nbvcxz.score == 1) {
                    $scope.pwStyle['background-color'] = '#FFC107';
                    $scope.strengthError.strength = true;
                }
                if ($scope.nbvcxz.score == 2) {
                    $scope.pwStyle['background-color'] = '#FFC107';
                    $scope.strengthError.strength = true;
                }
                if ($scope.nbvcxz.score == 3) {
                    $scope.pwStyle['background-color'] = 'green';
                    $scope.strengthError = {};
                }
                if ($scope.nbvcxz.score == 4) {
                    $scope.pwStyle['background-color'] = 'green';
                    $scope.strengthError = {};
                }

                return $scope.nbvcxz;
            };

            $scope.submit = function(){
                if ($scope.strengthError.strength){
                    return;
                }

                $http.post('/api/admin/register', $scope.user).then(function(data){
                    $window.location = '#/admin'
                }).catch(function(err){
                    alert(JSON.stringify(err));
                })
            };


        }])
        .directive('diffValidator', function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, el, attr, ngModelCtrl){
                    ngModelCtrl.$validators.diff = function(modelVal) {
                        if (modelVal !== null && modelVal !== '') {
                            return scope.user.password === modelVal;
                        } else {
                            return true;
                        }
                    }
                }
            }
        })

})();
