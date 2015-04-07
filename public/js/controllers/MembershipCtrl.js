/**
 * Created by abe on 2/3/15.
 */
(function(){
    angular.module('myApp.controllers')
        .controller('MembershipCtrl', ['$scope', '$window', '$log', '$http', 'Member', function($scope, $window, $log, $http, Member){
            $scope.updateTitle("Membership Application");
            $scope.numStudents = 0;
            $scope.data = {
                accepted: false,
                index: 0,
                accept: function(){
                    $scope.$apply(this.accepted = true);
                    this.index = 1;
                },
                next: function(){
                    this.index++;
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
                exp_date:null,
                cvv2:null,
                first:null,
                last:null,
                amount: null
            };

            $scope.changeStudents = function(num){
                var oldLength = $scope.user.students.length;
                if (num > oldLength){
                    for (var i = 0; i < (num - oldLength); i++){
                        $scope.user.students.push({
                            first: null,
                            last: null,
                            grade: null,
                            unit: null
                        });
                    }
                    $scope.data.index = 1;
                    $scope.data.index = 2;
                } else {
                    for (var i = 0; i < (oldLength - num); i++){
                        $scope.user.students.pop();
                    }
                }
            };

            $scope.newMember = function(isValid) {
                if (!isValid || $scope.data.index != 3){
                    return;
                }

                $scope.postData = {};
                $scope.postData.user = $scope.user;
                $scope.postData.payment = $scope.payment;
                $scope.member = new Member($scope.postData);

                //$log.debug($scope.postData);

                //sends the post data to the server.
                $scope.member.$save(function(data, headers){
                    console.log(data);
                    console.log(headers("Location"));
                    //$window.location.href = '/';
            });
        }
    }]);
})();
