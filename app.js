/**
 * Created by abe on 1/7/15.
 */
(function(){
var myApp = angular.module('myApp', ['ngMaterial'])
    .config(function($mdThemingProvider){
        $mdThemingProvider.theme('default')
            .primaryColor('amber')
            .accentColor('blue-grey');
    });

    myApp.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function(){
                    $log.debug("toggle left done")
                });
        };
    });
})();
