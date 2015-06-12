/**
 * Created by abe on 6/11/15.
 */
(function () {
    angular.module('myApp')
        .directive('diffValidator', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    differ: '='
                },
                link: function(scope, el, attr, ngModelCtrl) {
                    ngModelCtrl.$validators.diff = function(modelVal) {
                        if (modelVal !== null && modelVal !== '') {
                            return scope.differ === modelVal;
                        } else {
                            return true;
                        }
                    }
                }
            }
        })
        .directive('password', function() {
            return {
                restrict: 'E',
                templateUrl: 'partials/directives/password.tmpl.html',
                scope: {
                    pw: '=',
                    error: '='
                },
                controller: ['$scope', 'Calendar', function($scope, Calendar) {
                    $scope.error = {};
                    $scope.pwChange = function(password) {
                        $scope.nbvcxz = zxcvbn(password);

                        $scope.pwStyle = {'background-color':'#f44336', 'width': (($scope.nbvcxz.score+1) / 5) * 100 + '%', 'height': '2px'};
                        if ($scope.nbvcxz.score == 0)
                            $scope.error.strength = true;
                        if ($scope.nbvcxz.score == 1) {
                            $scope.pwStyle['background-color'] = '#FFC107';
                            $scope.error.strength = true;
                        }
                        if ($scope.nbvcxz.score == 2) {
                            $scope.pwStyle['background-color'] = '#FFC107';
                            $scope.error.strength = true;
                        }
                        if ($scope.nbvcxz.score == 3) {
                            $scope.pwStyle['background-color'] = 'green';
                            $scope.error = {};
                        }
                        if ($scope.nbvcxz.score == 4) {
                            $scope.pwStyle['background-color'] = 'green';
                            $scope.error = {};
                        }

                        return $scope.nbvcxz;
                    };
                }]
            }
        })
})();
