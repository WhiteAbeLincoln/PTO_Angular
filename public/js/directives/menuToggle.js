(function(){
    angular.module('myApp')
    .directive('menuToggle', function() {
        return {
            restrict: 'E',
            scope: {
                section: '='
            },
            templateUrl: 'partials/menu-toggle.tmpl.html',
            link: function($scope, $element){
                var controller = $element.parent().controller();

                $scope.isOpen = function() {
                    return controller.isOpen($scope.section);
                };
                $scope.toggle = function() {
                    controller.toggleOpen($scope.section);
                };
            }
        };
    });
})()
