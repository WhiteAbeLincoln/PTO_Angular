/**
 * Created by abe on 6/9/15.
 */
(function (angular) {
    angular.module('myApp')
        .directive('calendar', function() {
            return {
                restrict: 'E',
                templateUrl: 'partials/directives/calendar.tmpl.html',
                controller: ['$scope', 'Calendar', function($scope, Calendar) {
                    $scope.calendar = Calendar.query();
                }]
            }
        });
})(window.angular);
