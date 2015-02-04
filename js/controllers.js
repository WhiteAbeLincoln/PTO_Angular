(function(){
    var appControllers = angular.module('myApp.controllers', ['ngResource'])

    .factory('Member', ['$resource', function($resource){
           return $resource('localhost:8080/api/members/:id');
    }]);

    appControllers.controller('AppCtrl', ['$scope', '$mdSidenav', '$log', function($scope, $mdSidenav, $log) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function(){
                    $log.debug("toggle left done")
                });
        };
    }]);
	
})();
