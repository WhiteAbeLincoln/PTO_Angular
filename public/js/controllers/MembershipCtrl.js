/**
 * Created by abe on 2/3/15.
 */
(function(){
    angular.module('myApp.controllers')
        .controller('MembershipCtrl', ['$scope', '$window', 'Member', 'ChangeArray', 'REGEX_VALIDATORS', 'COMMON_OBJECTS', '$location', function($scope, $window, Member, ChangeArray, REGEX_VALIDATORS, COMMON_OBJECTS, $location) {
            $scope.updateTitle("Membership Application");
            $scope.changeArray = ChangeArray;
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
                last:null,
                address:null,
                city:null,
                state:null,
                postalCode: null,
                students: [
                    {
                        first: null,
                        last: null,
                        grade: null,
                        unit: null
                    }
                ]
            };
            $scope.payment = {
                number:null,
                exp_date: null,
                cvv2:null,
                first:null,
                last:null,
                amount: 0.00
            };

            $scope.studentObj = {
                first: null,
                last: null,
                grade: null,
                unit: null
            };

            $scope.newMember = function(isValid) {
                if (!isValid || $scope.data.index != 3){
                    return;
                }

                $scope.postData = {};
                $scope.postData.user = $scope.user;
                $scope.postData.payment = $scope.payment;
                $scope.member = new Member($scope.postData);

                //sends the post data to the server.
                console.log($scope.member);
               $scope.member.$save(function(data, headers){
                    $location.url("/");
                });


        }
    }])
        //checks to make sure the provided date is older than the current date
        .directive('expiredValidator', function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, el, attr, ngModelCtrl){
                    ngModelCtrl.$validators.expired = function(modelVal) {
                        if (modelVal !== null && modelVal !== '') {
                            return moment(modelVal, 'MM/YY').toDate() > new Date();
                        } else {
                            return true;
                        }
                    }
                }
            }
        })
})();
