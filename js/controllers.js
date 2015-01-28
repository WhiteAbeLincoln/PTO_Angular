(function(){
    var appControllers = angular.module('appControllers', []);

    appControllers.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function(){
                    $log.debug("toggle left done")
                });
        };
    });

    appControllers.controller('FormCtrl', ['$scope', function($scope){
        $scope.numStudents = 0;
        $scope.user = {
            "students": [
                {
                    "first": "",
                    "last": "",
                    "grade": "",
                    "unit": ""
                }
            ]
        };
        $scope.changeStudents = function(num){
            var oldLength = this.user.students.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.students.push({
                        "first": "",
                        "last": "",
                        "grade": "",
                        "unit": ""
                    });
                }
            } else {
                for (var i = 0; i < (oldLength - num); i++){
                    this.user.students.pop();
                }
            }
        }
    }]);
})();
