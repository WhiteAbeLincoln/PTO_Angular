/**
 * Created by abe on 6/7/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('CreateArticleCtrl', ['$scope', '$location', 'Article', 'ArticleService', '$mdDialog', function($scope, $location, Article, ArticleService, $mdDialog) {
            $scope.updateTitle('New Article');
            $scope.theTitle = 'New Article';
            $scope.article = {};
            $scope.article.body = "";
            $scope.article.author = $scope.currentUser.firstName + ' ' + $scope.currentUser.lastName;

            if (ArticleService.article) {
                $scope.article = ArticleService.article;
                $scope.updateTitle('Edit Article');
                $scope.theTitle = 'Edit Article';
            }

            $scope.cancel = function () {
                ArticleService.article = null;
                $location.url('/news');
            };

            $scope.submit = function() {
                if (ArticleService.article) {
                    var date = moment(ArticleService.article.date).format('YYYY-MM-DD');
                    var urlSlug = ArticleService.article.urlSlug;
                    Article.update({date: date, slug: urlSlug}, $scope.article).$promise.then(function(data) {
                        ArticleService.article = null;
                        $location.url('/news');
                    });
                } else {
                    var article = new Article($scope.article);
                    article.$save(function (data, headers) {
                        $location.url('/news');
                    });
                }
            };

            $scope.markdownDialog = function($event) {
                console.log('dialog');
                $mdDialog.show({
                    controller: ["$scope", "$mdDialog", function($scope, $mdDialog) {
                        $scope.hide = function() {
                            $mdDialog.hide();
                        }
                    }],
                    templateUrl: 'partials/markdown.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: $event
                 }).then(function(answer) {

                 })
            };
        }]);
})();
