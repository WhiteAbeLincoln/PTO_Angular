/**
 * Created by abe on 6/7/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('CreateArticleCtrl', ['$scope', '$location', 'Article', function($scope, $location, Article) {
            $scope.updateTitle('New Article');
            $scope.article = {};
            $scope.article.body = "";
            $scope.article.author = $scope.currentUser.firstName + ' ' + $scope.currentUser.lastName;

            $scope.cancel = function () {
                $location.url('/news');
            };

            $scope.submit = function() {
                var article = new Article($scope.article);
                article.$save(function(data, headers) {
                    $location.url('/news');
                });
            }
        }]);
})();
