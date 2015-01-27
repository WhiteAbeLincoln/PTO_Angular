/**
 * Created by abe on 1/7/15.
 */
(function(){
var myApp = angular.module('myApp', ['ngMaterial', 'ngRoute', 'appControllers'])
    .config(['$mdThemingProvider', '$routeProvider', function($mdThemingProvider, $routeProvider){

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.tmpl.html'
            })
            .when('/layout/:tmpl', {
                templateUrl: function(params){
                    return 'partials/layout-' + params.tmpl + '.tmpl.html';
                }
            });

        $mdThemingProvider.theme('default')
            .primaryColor('amber')
            .accentColor('blue-grey');
    }]);

    myApp.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function(){
                    $log.debug("toggle left done")
                });
        };
    });
})();
