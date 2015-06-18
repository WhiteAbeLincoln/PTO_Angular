/**
 * Created by abe on 6/10/15.
 */
(function (angular) {
    angular.module('myApp')
        .service('ArticleService', ['Article', function ArticleService(Article) {
            var article = this;
            article.article = null;
        }])
})(window.angular);
