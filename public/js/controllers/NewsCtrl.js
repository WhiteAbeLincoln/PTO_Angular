/**
 * Created by abe on 4/12/15.
 */
(function(){
    angular.module('myApp.controllers')
        .controller('NewsCtrl', ['$scope', '$mdMedia', function($scope, $mdMedia){
            console.log($mdMedia('gt-sm'));
            if ($mdMedia('gt-sm')){
                $scope.diediedie = {'width':'350px'};
            }

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
                    urlSlug: 'material-1-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
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
                    urlSlug: 'material-1-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
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
                    urlSlug: 'material-1-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                },
                {
                    image: 'https://www.aivanet.com/wp-content/uploads/2014/11/image_new12.jpg',
                    title:'New Material Article',
                    description:'A short Description of the article',
                    urlSlug: 'material-1-test',
                    year:'2015',
                    month:'4',
                    day:'12'
                }
            ]
        }]);
})();