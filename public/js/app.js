/**
 * Created by abe on 1/7/15.
 */
(function () {
    var myApp = angular.module('myApp', ['ngMaterial', 'ngRoute', 'myApp.controllers', 'ui.gravatar', 'smart-table'])
        .config(['$mdThemingProvider', '$routeProvider', '$mdIconProvider', '$httpProvider', 'gravatarServiceProvider',
            function ($mdThemingProvider, $routeProvider, $mdIconProvider, $httpProvider, gravatarSP) {
                $httpProvider.interceptors.push('ErrorInterceptor');
                $httpProvider.interceptors.push('AuthInterceptor');

                $routeProvider
                    .when('/', {
                        templateUrl: 'partials/home.tmpl.html',
                        restricted: false
                    })
                    .when('/forms/:tmpl', {
                        templateUrl: function (params) {
                            return 'partials/forms/' + params.tmpl + '.tmpl.html'
                        },
                        restricted: false
                    })
                    .when('/admin', {
                        templateUrl: 'partials/admin/index.tmpl.html',
                        controller: 'AdminCtrl',
                        restricted: true
                    })
                    .when('/admin/login', {
                        templateUrl: 'partials/admin/login.tmpl.html',
                        controller: 'LoginCtrl',
                        restricted: false
                    })
                    .when('/admin/forms/membership',{
                        templateUrl: 'partials/admin/forms/membership.tmpl.html',
                        controller: 'MembershipViewCtrl',
                        restricted: true
                    })
                    .when('/downloads', {
                        templateUrl: 'partials/downloads.tmpl.html',
                        controller: 'DownloadCtrl',
                        restricted: false
                    })
                    .when('/about-board', {
                        templateUrl: 'partials/about-board.tmpl.html',
                        restricted: false
                    })
                    .when('/volunteer', {
                        templateUrl: 'partials/volunteer.tmpl.html',
                        restricted: false
                    })
                    .when('/news', {
                        templateUrl: 'partials/news.tmpl.html',
                        restricted: false,
                        controller: 'NewsCtrl'
                    })
                    .when('/news/:year/:month/:day/:name', {
                        templateUrl: 'partials/article.tmpl.html',
                        restricted: false,
                        controller: 'ArticleCtrl'
                    })
                    .otherwise('/');

                $mdThemingProvider.theme('default')
                    .primaryPalette('amber')
                    .accentPalette('blue-grey');

                $mdIconProvider
                    .iconSet('file', 'img/icons/file-icons.svg')
                    .iconSet('action', 'img/icons/action-icons.svg')
                    .iconSet('content', 'img/icons/content-icons.svg')
                    .icon('file:document', 'img/icons/file-document-box.svg')
                    .icon('file:excel', 'img/icons/file-excel-box.svg')
                    .icon('file:image', 'img/icons/file-image-box.svg')
                    .icon('file:pdf', 'img/icons/file-pdf-box.svg')
                    .icon('file:powerpoint', 'img/icons/file-powerpoint-box.svg')
                    .icon('file:word', 'img/icons/file-word-box.svg')
                    .icon('file:file', 'img/icons/file.svg')
                    .icon('social:facebook', 'img/icons/social-facebook.svg')
                    .icon('social:google_plus', 'img/icons/social-google_plus.svg')
                    .icon('social:twitter', 'img/icons/social-twitter.svg');

                gravatarSP.defaults = {
                    size: 150,
                    "default": 'retro'
                };
            }])
        .run(['$rootScope', '$location', '$route', 'Session', function($rootScope, $location, $route, Session){
            $rootScope.$on('$locationChangeStart', function(event, next, current) {
                if (!Session.user()) {

                    var altPath = '/' + $location.path().split("/")[1] + '/:tmpl';
                    var nextRoute = $route.routes[$location.path()] || $route.routes[altPath] || $route.routes['/news/:year/:month/:day/:name'];
                    var currentPath = current.split('#')[1];
                    if (nextRoute.restricted && nextRoute.restricted !== currentPath){
                        $location.path('/admin/login');
                    }
                }
            })
        }])
        .filter('nospace', function () {
            return function (value) {
                return (!value) ? '' : value.replace(/ /g, '');
            };
        });
})();
