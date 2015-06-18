/**
 * Created by abe on 4/22/15.
 */
(function (angular) {
    angular.module('myApp')
        .directive('checkboxGroup', function(){
            return {
                restrict: 'E',
                scope: {
                    models: '=cbModels',
                    valid: '=cbValidity'
                },
                link: function(scope, element, attr, ctrl, transclude){
                    console.log(scope.models);
                    scope.valid = {};
                    scope.$apply(scope.valid.checked = true);
                    scope.$watchCollection('models', function(newC, oldC){
                        if (newC !== oldC){
                            console.log(newC);
                            scope.valid.checked = checkValidity(newC);
                            console.log(scope.valid.checked);
                        }
                    });

                    function checkValidity(arr) {
                        for(var i=0; i<arr.length; i++) {
                            if (arr[i]){
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }
        })
})(window.angular);
