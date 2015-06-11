/**
 * Created by abe on 6/10/15.
 */
(function () {
    angular.module('myApp')
        .directive('markdownHelp', function() {
            return {
                restrict: 'E',
                template: '<a href=""><small class="md-caption" ng-click="markdownDialog($event)" style="cursor: pointer">Markdown Cheatsheet</small></a>',
                controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
                    $scope.markdownDialog = function($event) {
                        $mdDialog.show({
                            controller: ["$scope", "$mdDialog", function ($scope, $mdDialog) {
                                $scope.hide = function () {
                                    $mdDialog.hide();
                                }
                            }],
                            templateUrl: '/partials/markdown.tmpl.html',
                            parent: angular.element(document.body),
                            targetEvent: $event
                        }).then(function (answer) {

                        })
                    };
                }]
            }
        });
})();
