/**
 * Created by abe on 1/7/15.
 */
(function () {
    var myApp = angular.module('myApp', ['ngMaterial', 'ngRoute', 'ngResource', 'ngMessages', 'myApp.controllers'])
        .config(['$mdThemingProvider', '$routeProvider', '$mdIconProvider', '$httpProvider',
            function ($mdThemingProvider, $routeProvider, $mdIconProvider, $httpProvider) {
                $httpProvider.interceptors.push('ErrorInterceptor');
                $httpProvider.interceptors.push('AuthInterceptor');

                //TODO: Load these from an editable file to allow for easy page addition, management w/o server restart
                $routeProvider
                    .when('/', {
                        templateUrl: 'partials/home.tmpl.html',
                        controller: 'HomeCtrl',
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
                        restricted: ['admin', 'scholarship']
                    })
                    .when('/admin/login', {
                        templateUrl: 'partials/admin/login.tmpl.html',
                        controller: 'LoginCtrl',
                        restricted: false
                    })
                    .when('/admin/register',{
                        templateUrl: 'partials/admin/register.tmpl.html',
                        controller: 'AdminRegisterCtrl',
                        restricted: ['admin']
                    })
                    .when('/admin/forms/membership',{
                        templateUrl: 'partials/admin/forms/membership.tmpl.html',
                        controller: 'MembershipViewCtrl',
                        restricted: ['admin']
                    })
                    .when('/admin/forms/scholarship',{
                        templateUrl: 'partials/admin/forms/scholarship.tmpl.html',
                        controller: 'ScholarshipViewCtrl',
                        restricted: ['scholarship']
                    })
                    .when('/admin/forms/service',{
                        templateUrl: 'partials/admin/forms/membership.tmpl.html',
                        restricted: ['scholarship']
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
                    .iconSet('navigation', 'img/icons/navigation-icons.svg')
                    .icon('navigation:arrow_up', 'img/icons/arrow-up.svg')
                    .icon('navigation:arrow_down', 'img/icons/arrow-down.svg')
                    .icon('file:zip', 'img/icons/file-zip-box.svg')
                    .icon('file:document', 'img/icons/file-document-box.svg')
                    .icon('file:excel', 'img/icons/file-excel-box.svg')
                    .icon('file:image', 'img/icons/file-image-box.svg')
                    .icon('file:pdf', 'img/icons/file-pdf-box.svg')
                    .icon('file:powerpoint', 'img/icons/file-powerpoint-box.svg')
                    .icon('file:word', 'img/icons/file-word-box.svg')
                    .icon('file:file', 'img/icons/file.svg')
                    .icon('file:markdown', 'img/icons/file-markdown.svg')
                    .icon('social:facebook', 'img/icons/social-facebook.svg')
                    .icon('social:google_plus', 'img/icons/social-google_plus.svg')
                    .icon('social:twitter', 'img/icons/social-twitter.svg');

            }])
        .run(['$rootScope', '$location', '$route', 'Session', 'AuthService', function($rootScope, $location, $route, Session, AuthService){
            $rootScope.$on('$locationChangeStart', function(event, next, current) {
                var altPath = '/' + $location.path().split("/")[1] + '/:tmpl';
                var nextRoute = $route.routes[$location.path()] || $route.routes[altPath] || $route.routes['/news/:year/:month/:day/:name'];
                var currentPath = current.split('#')[1];

                if (!Session.user()) {
                    if (nextRoute.restricted && nextRoute.restricted !== currentPath){
                        $location.path('/admin/login');
                    }
                } else {
                    if (nextRoute.restricted){
                        AuthService.isAuthorized(nextRoute.restricted).then(function(state){
                            if (!state) {
                                nextRoute.templateUrl = 'partials/error/forbidden.tmpl.html';
                                $route.reload();
                            }
                        });
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
