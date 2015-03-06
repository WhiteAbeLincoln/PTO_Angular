/**
 * Created by abe on 1/7/15.
 */
(function () {
    var myApp = angular.module('myApp', ['ngMaterial', 'ngRoute', 'myApp.controllers'])
        .config(['$mdThemingProvider', '$routeProvider', '$mdIconProvider',
            function ($mdThemingProvider, $routeProvider, $mdIconProvider) {

                $routeProvider
                    .when('/', {
                        templateUrl: 'partials/home.tmpl.html'
                    })
                    .when('/forms/:tmpl', {
                        templateUrl: function (params) {
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

                $mdIconProvider
                    .icon('file:document', 'img/icons/file-document-box.svg')
                    .icon('file:excel', 'img/icons/file-excel-box.svg')
                    .icon('file:image', 'img/icons/file-image-box.svg')
                    .icon('file:pdf', 'img/icons/file-pdf-box.svg')
                    .icon('file:powerpoint', 'img/icons/file-powerpoint-box.svg')
                    .icon('file:word', 'img/icons/file-word-box.svg')
                    .defaultIconSize('48px,48px');
            }]);
})();
