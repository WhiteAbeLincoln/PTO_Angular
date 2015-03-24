(function(){
    angular.module('myApp')
    .directive('menuLink', function() {
        return {
            restrict: 'E',
            scope: {
                section: '=' //on the page use attribute section=yourPage. the controller will look like $scope.yourPage, $scope.theirPage
            },
            templateUrl: 'partials/menu-link.tmpl.html',
            link: function($scope, $element){   //directives that modify DOM typically use link option
                var controller = $element.parent().controller();

                $scope.isSelected = function() {
                    return controller.isSelected($scope.section);
                };
            }
        };

    });
})()
