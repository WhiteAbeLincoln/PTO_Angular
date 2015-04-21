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
                properties: '=',
                remove: '&onDelete'
            },
            transclude:'true',
            templateUrl: 'partials/directives/data-table.tmpl.html',
            controller: ['$scope', '$filter', function($scope, $filter) {
                $scope.checkAll = function(check) {
                    if (check) {
                        $scope.filteredArr.forEach(function (row) {
                            row.$checked = true;
                            pushItem(row);
                        })
                    } else {
                        $scope.filteredArr.forEach(function (row) {
                            row.$checked = false;
                            popItem(row);
                        });
                    }
                };

                this.deleteSelected = function(timeout){
                    var toDelete = $scope.data.filter(function(val){
                        if (val.$checked){
                            return val;
                        }
                    });

                    $scope.data = $scope.data.filter(function(val){
                        if (!val.$checked){
                            return val;
                        }
                    });


                    $scope.remove({deleted: toDelete});
                };

                $scope.selected = [];
                $scope.viewLimit = 10;
                $scope.currentPage = 0;

                $scope.prevPage = function() {
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                    }
                };

                $scope.pageCount = function() {
                    return Math.ceil($scope.data.length/$scope.viewLimit)-1;
                };

                $scope.nextPage = function() {
                    if ($scope.currentPage < $scope.pageCount()) {
                        $scope.currentPage++;
                    }
                };

                $scope.getRange = function(){
                    $scope.filteredArr = $filter('limitTo')(
                      $filter('offset')($scope.data, $scope.currentPage*$scope.viewLimit),
                      $scope.viewLimit);
                    var firstEl = $scope.filteredArr[0];
                    var lastEl = $scope.filteredArr[$scope.filteredArr.length -1];

                    var first = $scope.data.indexOf(firstEl)+1;
                    var last = $scope.data.indexOf(lastEl)+1;

                    return first + '-' + last;
                };

                $scope.nextPageDisabled = function() {
                    return $scope.currentPage === $scope.pageCount();
                };

                $scope.$watchCollection('data', function(newData, oldData){
                   if (newData !== oldData){
                       $scope.selected = [];
                       newData.forEach(function(data){
                           if (data.$checked){
                               $scope.selected.push(data);
                           }
                       });
                       if ($scope.selected.length == 0){
                           $scope.$allChecked = false;
                       }
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
                '<div layout="row">' +
                '<ng-transclude layout="row"></ng-transclude>' +
                '<md-button class="md-icon-button" ng-click="deleteinator()"><md-icon md-svg-icon="action:delete" aria-label="Delete Selected"></md-icon></md-button>' +
                '</div>' +
                '</div>',
                link: function(scope, element, attr, ctrl){
                    scope.deleteinator = ctrl.deleteSelected;
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

                        });
                }

            }
        })
        .filter('offset', function(){
            return function(input, start) {
                start = parseInt(start, 10);
                return input.slice(start);
            }
        })
})();
