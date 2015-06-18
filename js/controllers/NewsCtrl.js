/**
 * Created by abe on 4/12/15.
 */
(function(angular) {
    angular.module('myApp.controllers')
        .controller('NewsCtrl', ['$scope', '$mdMedia', '$location', 'Article', 'ArticleService', '$mdToast', '$timeout', function($scope, $mdMedia, $location, Article, ArticleService, $mdToast, $timeout) {
            $scope.updateTitle("News");
            $scope.$watch(function(){return $mdMedia('gt-sm')},
                function(larger){
                    if (larger){
                        $scope.cardStyle = {'width':'375px', 'position':'relative'};
                        $scope.footerStyle = {'position': 'absolute', 'bottom': 0};
                        $scope.titleStyle = {'padding-bottom': '32px'};
                    } else {
                        $scope.cardStyle = null;
                        $scope.footerStyle = null;
                    }
                }
            );

            $scope.articles = Article.query();
            $scope.user = $scope.currentUser;

            $scope.readArticle = function(article) {
                var date = moment(article.date);
                var year = date.year();
                var day = date.date();
                var month = parseInt(date.months())+1;

                var url = '/news/'+ year +'/'+ month +'/'+ day +'/'+ article.urlSlug;
                $location.url(url);
            };

            $scope.editArticle = function(article, $event) {
                $event.stopPropagation();
                ArticleService.article = article;
                $location.url('/admin/new-article');
            };

            $scope.deleteArticle = function(article, idx, $event) {
                $event.stopPropagation();

                var toast = $mdToast.simple()
                    .content('Article Deleted')
                    .action('UNDO')
                    .highlightAction(true)
                    .position('bottom left')
                    .hideDelay(4000);

                var pDelete = $timeout(function(){
                    deleteIt()
                }, 4001);

                var resource = $scope.articles.splice(idx, 1);
                $mdToast.show(toast).then(function(){
                    $timeout.cancel(pDelete);
                    $scope.articles.splice(idx, 0, resource[0]);
                });

                function deleteIt() {
                    article.$delete(function() {
                        console.log('deleted');
                        console.log($scope.articles);
                    });
                }
            };
        }]);
})(window.angular);