/**
 * Created by abe on 2/3/15.
 */
(function() {
    angular.module('myApp.controllers')
        .controller('ScholarshipCtrl', ['$scope', '$log', '$http', 'Scholar', function($scope, $log, $http, Scholar){
            $scope.updateTitle("Scholarship -- Centerville PTO");

            $scope.numStudents = 0;
            $scope.data = {
                accepted: false,
                index: 0,
                accept: function(){
                    this.accepted = true;
                    this.index = 1;
                }
            };
            $scope.user = {
                first:"",
                middle:"",
                last:"",
                address:"",
                city:"",
                state:"",
                postalCode:"",
                phone:"",
                email:"",
                gpa:"",
                classes: {
                    nine:"",
                    ten:"",
                    eleven:"",
                    twelve:""
                },
                schoolActivities: [
                    {
                        name  :   "",
                        om    :   "",
                        hours :   "",
                        cb9   :   false,
                        cb10  :   false,
                        cb11  :   false,
                        cb12  :   false
                    }
                ],
                communityActivities: [
                    {
                        name: "",
                        om: "",
                        hours: "",
                        cb9: false,
                        cb10: false,
                        cb11: false,
                        cb12: false
                    }
                ],
                honors: [
                    {
                        name: "",
                        cb9: false,
                        cb10: false,
                        cb11: false,
                        cb12: false
                    }
                ],
                jobs: [
                    {
                        name: "",
                        hours: "",
                        months: "",
                        cb9: false,
                        cb10: false,
                        cb11: false,
                        cb12: false
                    }
                ],
                essay:""
            };
            $scope.changeSchoolActivity = function(num){
                var oldLength = this.user.schoolActivities.length;
                if (num > oldLength){
                    for (var i = 0; i < (num - oldLength); i++){
                        this.user.schoolActivities.push({
                            name: "",
                            om: "",
                            hours: "",
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
                            name: "",
                            om: "",
                            hours: "",
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
                            name: "",
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
                            name: "",
                            hours: "",
                            months: "",
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
