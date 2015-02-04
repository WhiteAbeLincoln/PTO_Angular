/**
 * Created by abe on 2/3/15.
 */
(function() {
    angular.module('myApp.controllers')
        .controller('ScholarshipCtrl', ['$scope', function($scope){
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
            "middle":"",
            "last":"",
            "address":"",
            "city":"",
            "state":"",
            "postalCode":"",
            "phone":"",
            "email":"",
			"gpa":"",
			"nine":"",
			"ten":"",
			"eleven":"",
			"twelve":"",
			
			
            "activities": [
                {
                    "name": "",
                    "om": "",
                    "hours": "",
                    "grades": ""
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
        $scope.changeSActivity = function(num){
            var oldLength = this.user.activities.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.activities.push({
                        "name": "",
                    "om": "",
                    "hours": "",
                    "grades": ""
                    });
                }
            } else {
                for (var i = 0; i < (oldLength - num); i++){
                    this.user.activities.pop();
                }
            }
        }
    }]);

})();
