/**
 * Created by 31160 on 4/15/2015.
 */
angular.module('myApp.controllers')
    .controller('ArticleCtrl', ['$scope', '$routeParams', 'Article', function($scope, $routeParams, Article) {
        $scope.urlDate =
            moment($routeParams.year + '-' + $routeParams.month + '-' + $routeParams.day)
                .format('YYYY-MM-DD');

        $scope.article = Article.get({slug: $routeParams.name, date: $scope.urlDate}, function() {
            $scope.updateTitle($scope.article.title);
        });


    }]);