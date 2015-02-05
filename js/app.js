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
                  return  'partials/forms/' + params.tmpl + '.tmpl.html'
                }

            });

        $mdThemingProvider.theme('default')
            .primaryPalette('amber')
            .accentPalette('blue-grey');
    }])

    .factory('menu' ['$location', '$rootScope', function($location, $rootScope){

        var sections = [{       //sample link
            name: 'News',
            url: '/news',
            type: 'link'
        }];

        //sample dropdown with sub pages -- could move this to a constant in future. see content-data.js in material docs
        sections.push({
            name: 'Forms',
            type: 'toggle', // note the type
            pages: [{
                name: 'Membership',
                url: '/forms/membership',
                type: 'link'
            },
                {
                    name: 'Scholarship Application',
                    url: '/forms/scholarship',
                    type: 'link'
                },
                {
                    name: 'Service Scholarship Application',
                    url: '/forms/service-scholarship',
                    type: 'link'
                },
                {
                    name: 'Board Membership',
                    url: '/forms/board-membership',
                    type: 'link'
                }]
        });

        sections.push(
            {
                name: 'Volunteer',
                url: '/volunteer',
                type: 'link'
            },
            {
                name:'Meet the Board',
                url: '/about-board'
            },
            {
                name:'Downloads',
                url: '/downloads'
            }
        );

        var self;

        return self = {

        }
    }])

    .directive('menuLink', function() {
        return {
            restrict: 'E',
            scope: {
                page: '=' //on the page use attribute page=yourPage. the controller will look like $scope.yourPage, $scope.theirPage
            },
            templateUrl: '/partials/menu-link.tmpl.html',
            link: function($scope, $element){   //directives that modify DOM typically use link option
                var controller = $element.parent().controller();

                $scope.isSelected = function() {
                    return controller.isSelected($scope.page);
                };
            }
        };

    })


})();
