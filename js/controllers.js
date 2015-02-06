(function(){
    var appControllers = angular.module('myApp.controllers', ['ngResource'])

    .factory('Member', ['$resource', function($resource){
           return $resource('http://localhost:8080/api/members/:id');
    }])
	
	.factory('Scholar', ['$resource', function($resource){
           return $resource('http://localhost:8080/api/scholars/:id');
    }])
	
	.factory('Service', ['$resource', function($resource){
           return $resource('http://localhost:8080/api/service/:id');
    }]);

    appControllers.controller('AppCtrl', ['$scope', '$mdSidenav', '$log', function($scope, $mdSidenav, $log) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function(){
                    $log.debug("toggle left done")
                });
        };


        //for the menuLink directive
        $scope.isSelected = isSelected;

        function isSelected(page) {
            return menu.isPageSelected(page);
        }
    }]);
	
})();
