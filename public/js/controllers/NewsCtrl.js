/**
 * Created by abe on 4/12/15.
 */
(function(){
    angular.module('myApp.controllers')
        .controller('NewsCtrl', ['$scope', '$mdMedia', '$location', function($scope, $mdMedia, $location){
            $scope.$watch(function(){return $mdMedia('gt-sm')},
                function(larger){
                    if (larger){
                        $scope.diediedie = {'width':'375px'};
                    } else {
                        $scope.diediedie = null;
                    }
                }
            );

            $scope.readArticle = function(article){
                var url = '/news/'+article.year+'/'+article.month+'/'+article.day+'/'+article.urlSlug;
                console.log(url);
                $location.url(url);
            };


            $scope.articles = [
                {
                    image: 'http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0Bx4BSt6jniD7VG9DQVluOFJ4Tnc/materialdesign_principles_metaphor.png',
                    title:'New Material Article',
                    description:'A short Description of the article',
                    urlSlug: 'material-1-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    title:'New Material Article',
                    description:'A short Description of the article',
                    urlSlug: 'material-2-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    title:'New Material Article',
                    description:'A short Description of the article',
                    urlSlug: 'material-3-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    title:'New Material Article',
                    description:'A short Description of the article',
                    urlSlug: 'material-4-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    description:'A short Description of the article',
                    urlSlug: 'material-5-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    title:'New Material Article',
                    description:'A short Description of the article',
                    urlSlug: 'material-6-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    title:'New Material Article',
                    description:'A short Description of the article',
                    urlSlug: 'material-7-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                }
            ]
        }]);
})();