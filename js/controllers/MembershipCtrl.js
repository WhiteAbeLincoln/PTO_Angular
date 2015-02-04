/**
 * Created by abe on 2/3/15.
 */
(function(){
    angular.module('myApp.controllers')
        .controller('MembershipCtrl', ['$scope', 'Member', function($scope, Member){
        $scope.numStudents = 0;
        $scope.data = {
            'accepted': false,
            'index': 0,
            'accept': function(){
                this.accepted = true;
                this.index = 1;
            }
        };
        $scope.user = {
            "first":"",
            "last":"",
            "address":"",
            "city":"",
            "state":"",
            "postalCode":"",
            "students": [
                {
                    "first": "",
                    "last": "",
                    "grade": "",
                    "unit": ""
                }
            ]
        };
        $scope.payment = {
            "card": {
                "type":"",
                "number":"",
                "exp_month":"",
                "exp_year":"",
                "cvv2":"",
                "first_name":"",
                "last_name":""
            },
            "amount": ""
        };

        $scope.changeStudents = function(num){
            var oldLength = this.user.students.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.students.push({
                        "first": "",
                        "last": "",
                        "grade": "",
                        "unit": ""
                    });
                }
            } else {
                for (var i = 0; i < (oldLength - num); i++){
                    this.user.students.pop();
                }
            }
        }

        $scope.newMember = function() {
            $scope.postData = {};
            $scope.postData.user = $scope.user;
            $scope.postData.payment = $scope.payment;
            $scope.member = new Member($scope.postData);

            $scope.member.$save();
        }
    }]);
})();
