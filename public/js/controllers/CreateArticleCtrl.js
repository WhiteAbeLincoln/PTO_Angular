/**
 * Created by abe on 6/7/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('CreateArticleCtrl', ['$scope', '$location', 'Article', function($scope, $location, Article) {
            $scope.updateTitle('New Article');
            $scope.article = {};
            $scope.article.text = "";

            $scope.cancel = function () {
                $location.url('/news');
            };

            $scope.submit = function() {
                var article = new Article($scope.article);
                article.$save(function(data, headers) {
                   console.log(data);
                    $location.url('/news');
                });
            }
        }]);
})();
