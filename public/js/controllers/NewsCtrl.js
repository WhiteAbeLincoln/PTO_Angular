/**
 * Created by abe on 4/12/15.
 */
(function(){
    angular.module('myApp.controllers')
        .controller('NewsCtrl', ['$scope', '$mdMedia', '$location', '$mdDialog', 'Article', function($scope, $mdMedia, $location, $mdDialog, Article){
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

            $scope.readArticle = function(article){
                var date = moment(article.date);
                var year = date.year();
                var day = date.date();
                var month = parseInt(date.months())+1;

                var url = '/news/'+ year +'/'+ month +'/'+ day +'/'+ article.urlSlug;
                $location.url(url);
            };
        }]);
})();