/**
 * Created by abe on 4/12/15.
 */
(function(){
    angular.module('myApp.controllers')
        .controller('NewsCtrl', ['$scope', '$mdMedia', '$location', function($scope, $mdMedia, $location){
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

            $scope.user = $scope.currentUser;

            $scope.readArticle = function(article){
                var url = '/news/'+article.year+'/'+article.month+'/'+article.day+'/'+article.urlSlug;
                console.log(url);
                $location.url(url);
            };


            $scope.articles = [
                {
                    image: 'http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0Bx4BSt6jniD7VG9DQVluOFJ4Tnc/materialdesign_principles_metaphor.png',
                    title:'Case Against Google May Be Undercut by Rapid Shifts in Tech',
                    description:'A short Description of the article',
                    urlSlug: 'material-1-test',
                    author: 'This is the footer',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {

                    title:'Sizing Microsoft Azure and Amazon AWS Revenue',
                    description:'WASHINGTON (AP) - A California woman says her brother is really terrible at lawyering, but he denied the claim, and took her to court on defamation charges',
                    urlSlug: 'material-2-test',
                    author: 'John Doe',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0Bx4BSt6jniD7VG9DQVluOFJ4Tnc/materialdesign_principles_metaphor.png',
                    title:'Europe opens antitrust investigation into Android',
                    description:'A short Description of the article',
                    urlSlug: 'material-3-test',
                    author: 'This is the footer',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    title:'How Factory Workers Learned to Love Robots',
                    description:'A short Description of the article',
                    urlSlug: 'material-4-test',
                    author: 'John Doe',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0Bx4BSt6jniD7VG9DQVluOFJ4Tnc/materialdesign_principles_metaphor.png',
                    title:'Surface 3 review: Finally, a cheap Surface you\'d actually want',
                    description:'A short Description of the article',
                    urlSlug: 'material-5-test',
                    author: 'John Doe',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    title:'FCC Boss Wheeler Tells Broadcasters Net Neutrality is Good for Them',
                    description:'A short Description of the article',
                    urlSlug: 'material-6-test',
                    author: 'John Doe',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0Bx4BSt6jniD7VG9DQVluOFJ4Tnc/materialdesign_principles_metaphor.png',
                    title:'Dropbox teams up with HackerOne for bug bounty program',
                    description:'A short Description of the article',
                    urlSlug: 'material-7-test',
                    author: 'John Doe',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    title:'Dropbox teams up with HackerOne for bug bounty program',
                    description:'A short Description of the article',
                    urlSlug: 'material-7-test',
                    author: 'John Doe',
                    year:'2015',
                    month:'4',
                    day:'12'
                }
            ]
        }]);
})();