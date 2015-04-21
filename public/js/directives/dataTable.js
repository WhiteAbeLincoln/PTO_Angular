/**
 * Created by abe on 4/20/15.
 */
(function () {
    angular.module('myApp')
        .directive('mdtDataTable', DataTable);
    function DataTable() {
        return {
            restrict: 'E',
            scope: {
                title: '@',
                headers: '=',
                data: '=',
                properties: '='
            },
            transclude:'true',
            templateUrl: 'partials/directives/data-table.tmpl.html',
            controller: ['$scope', function($scope) {
                $scope.checkAll = function(check) {
                    if (check) {
                        $scope.data.forEach(function (row) {
                            row.$checked = true;
                            pushItem(row);
                        })
                    } else {
                        $scope.data.forEach(function (row) {
                            row.$checked = false;
                            popItem(row);
                        });
                    }
                };
                $scope.selected = [];

                $scope.$watchCollection('data', function(newData, oldData){
                   if (newData !== oldData){
                       $scope.selected.forEach(function(select, idx){
                           if (newData.indexOf(select) == -1){
                               $scope.selected.splice(idx, 1);
                               console.log($scope.selected);
                           }
                       })
                   }
                });

                $scope.checkItem = function(check, item) {
                    if (check) {
                        pushItem(item);
                    } else if ($scope.selected.length > 0) {
                        popItem(item);
                    }

                    if ($scope.selected.length == $scope.data.length){
                        $scope.$allChecked = true;
                    } else {
                        $scope.$allChecked = false;
                    }
                };

                function pushItem(item){
                    if ($scope.selected.indexOf(item) == -1) {
                        $scope.selected.push(item);
                    }
                }

                function popItem(item){

                    if ($scope.selected.indexOf(item) !== -1){
                        $scope.selected.splice($scope.selected.indexOf(item), 1);
                    }
                }

                $scope.customHeader = false;

                this.setHeader = function(val){
                    $scope.customHeader = val;
                };
                this.getSelected = function(){return $scope.selected.length};
            }]
        }
    }
    function postLink(scope, element, attr, ctrl) {

    }
    angular.module('myApp')
        .directive('mdtTableHeader', function(){
            return {
                restrict: 'E',
                transclude: 'true',
                require: '^mdtDataTable',
                template: '<div ng-transclude></div>',
                link: function(scope, element, attr, ctrl){
                    ctrl.setHeader(true);
                }
            }
        })
        .directive('mdtSelectActions', function(){
            return {
                restrict: 'E',
                transclude: 'true',
                require:'^mdtDataTable',
                scope: true,
                template:
                '<div ng-if="anything" layout="row" layout-align="space-between center">' +
                '<h2 class="md-title">' +
                '<ng-pluralize count="selector" when="{\'one\':\'1 row selected\', \'other\': \'{} rows selected\'}"></ng-pluralize>' +
                '</h2>' +
                '<div ng-transclude layout="row"></div>' +
                '</div>',
                link: function(scope, element, attr, ctrl){
                    scope.selector = ctrl.getSelected();
                    scope.$watch(ctrl.getSelected,
                        function(newVal, old){
                            if (newVal !== old){
                                scope.selector = newVal;
                            }

                            if (scope.selector > 0) {
                                ctrl.setHeader(true);
                                scope.anything = true;
                            } else {
                                ctrl.setHeader(false);
                                scope.anything = false;
                            }

                        }) ;
                }

            }
        })
})();
