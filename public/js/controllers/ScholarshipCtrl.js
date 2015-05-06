/**
 * Created by abe on 2/3/15.
 */
(function() {
    angular.module('myApp.controllers')
        .controller('ScholarshipCtrl', ['$scope', 'Scholar', 'ChangeArray', 'REGEX_VALIDATORS', 'COMMON_OBJECTS', function($scope, Scholar, ChangeArray, REGEX_VALIDATORS, COMMON_OBJECTS){
            $scope.updateTitle("Scholarship Application");

            $scope.regexs = REGEX_VALIDATORS;
            $scope.states = COMMON_OBJECTS.usStates;

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

            $scope.activityObj = {
                name: null,
                position: null,
                hours: null,
                cb9: false,
                cb10: false,
                cb11: false,
                cb12: false
            };

            $scope.honorsObj = {
                name: null,
                cb9: false,
                cb10: false,
                cb11: false,
                cb12: false
            };

            $scope.jobObj = {
                name: null,
                hours: null,
                months: null,
                cb9: false,
                cb10: false,
                cb11: false,
                cb12: false
            };

            $scope.changeArray = ChangeArray;

            $scope.newScholar = function() {
                $scope.postData = {};

                //removes phone separator characters. phone now looks like 11234567890
                //allows for easy comparison in database
                $scope.user.phone = $scope.user.phone.replace(/[() +-.]/g, "");

                $scope.postData.user = $scope.user;
                $scope.scholar = new Scholar($scope.postData);

                console.log($scope.postData);

                //sends the post data to the server.
                $scope.scholar.$save();
            }
    }]);

})();
