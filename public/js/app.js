/**
 * Created by abe on 1/7/15.
 */
(function(){
var myApp = angular.module('myApp', ['ngMaterial', 'ngRoute', 'myApp.controllers'])
    .config(['$mdThemingProvider', '$routeProvider', function($mdThemingProvider, $routeProvider){

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.tmpl.html'
            })
            .when('/forms/:tmpl', {
                templateUrl: function(params){
					return 'partials/forms/' + params.tmpl + '.tmpl.html'
                }

            })
			.when('/downloads', {
                templateUrl: 'partials/downloads.tmpl.html',
                controller: 'DownloadCtrl'
            })
            .otherwise('/');

        $mdThemingProvider.theme('default')
            .primaryPalette('amber')
            .accentPalette('blue-grey');
    }]);
})();
