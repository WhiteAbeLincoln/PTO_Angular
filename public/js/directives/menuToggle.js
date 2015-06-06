(function(){
    angular.module('myApp')
    .directive('menuToggle', function() {
        return {
            restrict: 'E',
            scope: {
                section: '='
            },
            templateUrl: 'partials/directives/menu-toggle.tmpl.html',
            link: function($scope, $element){
                var controller = $element.parent().controller();
                var $ul = $element.find('ul');
                var originalHeight;

                $scope.isOpen = function() {
                    return controller.isOpen($scope.section);
                };

                $scope.toggle = function() {
                    controller.toggleOpen($scope.section);
                };

                $scope.$watch(
                    function() {
                        return controller.isOpen($scope.section);
                    },
                    function(open) {
                        if (!open) originalHeight = $ul.prop('clientHeight');
                        $element.find('ul').css({ height: (open ? originalHeight : 0) + 'px' });
                    }
                );

                var parentNode = $element[0].parentNode.parentNode.parentNode;
                if(parentNode.classList.contains('parent-list-item')) {
                    var heading = parentNode.querySelector('h2');
                    $element[0].firstChild.setAttribute('aria-describedby', heading.id);
                }
            }
        };
    });
})();
