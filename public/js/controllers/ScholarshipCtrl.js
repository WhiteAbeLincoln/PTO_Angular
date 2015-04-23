/**
 * Created by abe on 2/3/15.
 */
(function() {
    angular.module('myApp.controllers')
        .controller('ScholarshipCtrl', ['$scope', '$log', '$http', 'Scholar', function($scope, $log, $http, Scholar){
            $scope

            $scope.updateTitle("Scholarship Application");
            $scope.data = {
                index: 0,
                next: function(){
                    $scope.data.index++;
                }
            };

            $scope.user = {
                first:null,
                middle:null,
                last:null,
                address:null,
                city:null,
                state:null,
                postalCode:null,
                phone:null,
                email:null,
                gpa:null,
                classes: {
                    nine:null,
                    ten:null,
                    eleven:null,
                    twelve:null
                },
                schoolActivities: [
                    {
                        name     :   null,
                        position :   null,
                        hours    :   null,
                        cb9      :   false,
                        cb10     :   false,
                        cb11     :   false,
                        cb12     :   false
                    }
                ],
                communityActivities: [
                    {
                        name     :   null,
                        position :   null,
                        hours    :   null,
                        cb9      :   false,
                        cb10     :   false,
                        cb11     :   false,
                        cb12     :   false
                    }
                ],
                honors: [
                    {
                        name: null,
                        cb9: false,
                        cb10: false,
                        cb11: false,
                        cb12: false
                    }
                ],
                jobs: [
                    {
                        name: null,
                        hours: null,
                        months: null,
                        cb9: false,
                        cb10: false,
                        cb11: false,
                        cb12: false
                    }
                ],
                essay:null
            };
            $scope.changeSchoolActivity = function(num){
                var oldLength = this.user.schoolActivities.length;
                if (num > oldLength){
                    for (var i = 0; i < (num - oldLength); i++){
                        this.user.schoolActivities.push({
                            name: null,
                            om: null,
                            hours: null,
                            cb9: false,
                            cb10: false,
                            cb11: false,
                            cb12: false
                        });
                    }
                } else {
                    for (var i = 0; i < (oldLength - num); i++){
                        this.user.schoolActivities.pop();
                    }
                }
            };
            $scope.changeCommunityActivity = function(num){
                var oldLength = this.user.communityActivities.length;
                if (num > oldLength){
                    for (var i = 0; i < (num - oldLength); i++){
                        this.user.communityActivities.push({
                            name: null,
                            om: null,
                            hours: null,
                            cb9: false,
                            cb10: false,
                            cb11: false,
                            cb12: false
                        });
                    }
                } else {
                    for (var i = 0; i < (oldLength - num); i++){
                        this.user.communityActivities.pop();
                    }
                }
            };
            $scope.changeHonors = function(num){
                var oldLength = this.user.honors.length;
                if (num > oldLength){
                    for (var i = 0; i < (num - oldLength); i++){
                        this.user.honors.push({
                            name: null,
                            cb9: false,
                            cb10: false,
                            cb11: false,
                            cb12: false
                        });
                    }
                } else {
                    for (var i = 0; i < (oldLength - num); i++){
                        this.user.honors.pop();
                    }
                }
            };
            $scope.changeJob = function(num){
                var oldLength = this.user.jobs.length;
                if (num > oldLength){
                    for (var i = 0; i < (num - oldLength); i++){
                        this.user.jobs.push({
                            name: null,
                            hours: null,
                            months: null,
                            cb9: false,
                            cb10: false,
                            cb11: false,
                            cb12: false
                        });
                    }
                } else {
                    for (var i = 0; i < (oldLength - num); i++){
                        this.user.jobs.pop();
                    }
                }
            };

            $scope.newScholar = function() {
                $scope.postData = {};

                $scope.user.phone = $scope.user.phone.replace(/[() +-]/g, "");

                $scope.postData.user = $scope.user;
                $scope.scholar = new Scholar($scope.postData);

                $log.debug($scope.postData);

                //sends the post data to the server.
                $scope.scholar.$save();
            }
    }]);

})();
