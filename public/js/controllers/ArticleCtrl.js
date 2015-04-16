/**
 * Created by 31160 on 4/15/2015.
 */
angular.module('myApp.controllers')
    .controller('ArticleCtrl', ['$scope', '$routeParams', function($scope, $routeParams){
        $scope.params = $routeParams;
        $scope.updateTitle($scope.params.name);
    }]);