/**
 * Created by abe on 1/7/15.
 */
(function () {
    var myApp = angular.module('myApp', ['ngMaterial', 'ngRoute', 'myApp.controllers'])
        .config(['$mdThemingProvider', '$routeProvider', '$mdIconProvider', '$httpProvider',
            function ($mdThemingProvider, $routeProvider, $mdIconProvider, $httpProvider) {
                $httpProvider.interceptors.push('ErrorInterceptor');
                $httpProvider.interceptors.push('AuthInterceptor');

                $routeProvider
                    .when('/', {
                        templateUrl: 'partials/home.tmpl.html'
                    })
                    .when('/forms/:tmpl', {
                        templateUrl: function (params) {
                            return 'partials/forms/' + params.tmpl + '.tmpl.html'
                        }
                    })
                    .when('/admin', {
                        templateUrl: 'partials/admin/index.tmpl.html'
                    })
                    .when('/admin/:tmpl',{
                        templateUrl: function(params){
                            return 'partials/admin/' + params.tmpl + '.tmpl.html';
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
                    .iconSet('file', 'img/icons/file-icons.svg')
                    .icon('file:document', 'img/icons/file-document-box.svg')
                    .icon('file:excel', 'img/icons/file-excel-box.svg')
                    .icon('file:image', 'img/icons/file-image-box.svg')
                    .icon('file:pdf', 'img/icons/file-pdf-box.svg')
                    .icon('file:powerpoint', 'img/icons/file-powerpoint-box.svg')
                    .icon('file:word', 'img/icons/file-word-box.svg')
                    .icon('file:file', 'img/icons/file.svg')
                    .defaultIconSize('48,48');
            }]);
})();
