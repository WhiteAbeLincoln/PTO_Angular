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
                title: '@mdtTitle',
                headers: '=mdtHeaders',
                data: '=mdtData',
                properties: '=mdtProps',
                remove: '&mdtOnDelete',
                search: '=mdtSearch'
            },
            transclude:'true',
            templateUrl: 'partials/directives/data-table.tmpl.html',
            controller: ['$scope', '$filter', function($scope, $filter) {
                $scope.checkAll = function(check) {
                    if (check) {
                        updateFilter();
                        $scope.allFilter.forEach(function (row) {
                            row.$checked = true;
                            pushItem(row);
                        });
                    } else {
                        updateFilter();
                        $scope.allFilter.forEach(function (row) {
                            row.$checked = false;
                            popItem(row);
                        });
                    }
                };
                $scope.doSearch = false;
                $scope.searchFilter = {};

                $scope.toggleSearch = function(){
                    $scope.doSearch = !$scope.doSearch;
                };

                this.deleteSelected = function(timeout){
                    var toDelete = $scope.data.filter(function(val){
                        return val.$checked;
                    });

                    $scope.data = $scope.data.filter(function(val){
                        return !val.$checked;
                    });


                    $scope.remove({deleted: toDelete});
                };

                $scope.selected = [];
                $scope.pageAllSelected = [];
                $scope.viewLimit = 10;
                $scope.currentPage = 0;
                $scope.sortedColumn = {};
                $scope.sortedColumn.predicate = '';
                $scope.hoverStyle = {};
                $scope.hoverStyle.idx = '';

                $scope.hoverStyle.isHovered = function(idx){
                     return idx === $scope.hoverStyle.idx && $scope.sortedColumn.predicate.substring(1) !== $scope.properties[idx];
                };

                $scope.hoverStyle.shouldStyle = function(idx){
                    if ($scope.sortedColumn.predicate.substring(1) !== $scope.properties[idx]){
                        return $scope.hoverStyle.style;
                    } else {
                        return '';
                    }
                };

                $scope.setHover = function(idx){
                    $scope.hoverStyle.style = {'color': 'rgba(0,0,0,.26)'};
                    $scope.hoverStyle.idx = idx;
                };
                $scope.clearHover = function(){
                    $scope.hoverStyle.style = '';
                    $scope.hoverStyle.idx = '';
                };

                $scope.sort = function(idx){
                    var order = '';

                    //if the order is current order is ascending, then set it to desc (-)
                    if ($scope.sortedColumn.order) {
                        order = $scope.sortedColumn.order == '+' ? '-' : '+';
                    } else {
                        order = '+';
                    }

                    //if the current sorted column is different from the new one, we start in ascending order
                    if ($scope.sortedColumn.predicate.substring(1) !== $scope.properties[idx]) {
                        order = '+';
                    }

                    //if the new column is the same as the last column and the sort is descending, remove the sort
                    if ($scope.sortedColumn.predicate == '-' + $scope.properties[idx]){
                        $scope.sortedColumn = {};
                        $scope.sortedColumn.predicate = '';
                    } else {
                        //otherwise set the selected sort order
                        $scope.sortedColumn.predicate = order + $scope.properties[idx];
                        $scope.sortedColumn.index = idx;
                        $scope.sortedColumn.order = order;
                    }


                };

                $scope.prevPage = function() {
                    if ($scope.currentPage > 0) {
                        $scope.currentPage--;
                        updateFilter();
                        updateAllChecked();
                    }
                };

                $scope.pageCount = function() {
                    return Math.ceil($scope.data.length/$scope.viewLimit)-1;
                };

                $scope.nextPage = function() {
                    if ($scope.currentPage < $scope.pageCount()) {
                        $scope.currentPage++;
                        updateFilter();
                        updateAllChecked();
                    }
                };

                $scope.nextPageDisabled = function() {
                    if ($scope.currentPage === $scope.pageCount())
                        $scope.nextStyle = {color:'#CCC'};
                    else
                        $scope.nextStyle = '';

                    return $scope.currentPage === $scope.pageCount();
                };

                $scope.previousPageDisabled = function() {
                    if ($scope.currentPage === 0)
                        $scope.previousStyle = {color:'#CCC'};
                    else
                        $scope.previousStyle = '';
                    return $scope.currentPage === 0;
                };

                $scope.getRange = function(){
                    updateFilter();
                    var firstEl = $scope.rangeFilter[0];
                    var lastEl = $scope.rangeFilter[$scope.rangeFilter.length -1];

                    var first = $scope.data.indexOf(firstEl)+1;
                    var last = $scope.data.indexOf(lastEl)+1;

                    return first + '-' + last;
                };

                function updateAllChecked(){
                    $scope.$allChecked = $scope.allFilter.every(function (row) {
                        return row.$checked
                    });
                }

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

                    updateAllChecked();
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

                function updateFilter() {
                    $scope.rangeFilter = $filter('limitTo')(
                        $filter('offset')($scope.data, $scope.currentPage*$scope.viewLimit),
                        $scope.viewLimit);

                    $scope.allFilter =
                            $filter('limitTo')(
                                $filter('offset')(
                                    $filter('orderBy')(
                                        $filter('filter')($scope.data, $scope.searchFilter),
                                    $scope.sortedColumn.predicate),
                                $scope.currentPage*$scope.viewLimit),
                            $scope.viewLimit);
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
                require: '^mdtDataTable',
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
