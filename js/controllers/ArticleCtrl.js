/**
 * Created by 31160 on 4/15/2015.
 */
(function(angular) {
    angular.module('myApp.controllers')
        .controller('ArticleCtrl', ['$scope', '$routeParams', 'Article', function ($scope, $routeParams, Article) {
            $scope.urlDate =
                moment([$routeParams.year, $routeParams.month - 1, $routeParams.day])
                    .format('YYYY-MM-DD');

            $scope.article = Article.get({slug: $routeParams.name, date: $scope.urlDate}, function () {
                $scope.updateTitle($scope.article.title);
            });


        }]);
})(window.angular);