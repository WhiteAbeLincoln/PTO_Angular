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
			"SchoolActivities": [
                {
                    "name": "",
                    "om": "",
                    "hours": "",
					"cb9": false,
					"cb10": false,
					"cb11": false,
					"cb12": false
                }
            ],
			"CommunityActivities": [
                {
                    "name": "",
                    "om": "",
                    "hours": "",
                    "cb9": false,
					"cb10": false,
					"cb11": false,
					"cb12": false
                }
            ],
			"Honors": [
                {
                    "name": "",
                    "cb9": false,
					"cb10": false,
					"cb11": false,
					"cb12": false
                }
            ],
			"Jobs": [
                {
                    "name": "",
					"hours": "",
					"months": "",
					"cb9": false,
					"cb10": false,
					"cb11": false,
					"cb12": false
                }
            ],
			"essay":""
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
        $scope.changeSchoolActivity = function(num){
            var oldLength = this.user.SchoolActivities.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.SchoolActivities.push({
                        "name": "",
						"om": "",
						"hours": "",
						"cb9": false,
						"cb10": false,
						"cb11": false,
						"cb12": false
                    });
                }
            } else {
                for (var i = 0; i < (oldLength - num); i++){
                    this.user.SchoolActivities.pop();
                }
            }
        };
		$scope.changeCommunityActivity = function(num){
            var oldLength = this.user.CommunityActivities.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.CommunityActivities.push({
                        "name": "",
						"om": "",
						"hours": "",
						"cb9": false,
						"cb10": false,
						"cb11": false,
						"cb12": false
                    });
                }
            } else {
                for (var i = 0; i < (oldLength - num); i++){
                    this.user.CommunityActivities.pop();
                }
            }
        };
		$scope.changeHonors = function(num){
            var oldLength = this.user.Honors.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.Honors.push({
                        "name": "",
						"cb9": false,
						"cb10": false,
						"cb11": false,
						"cb12": false
                    });
                }
            } else {
                for (var i = 0; i < (oldLength - num); i++){
                    this.user.Honors.pop();
                }
            }
        };
		$scope.changeJob = function(num){
            var oldLength = this.user.Jobs.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.Jobs.push({
                        "name": "",
						"hours": "",
						"months": "",
						"cb9": false,
						"cb10": false,
						"cb11": false,
						"cb12": false
                    });
                }
            } else {
                for (var i = 0; i < (oldLength - num); i++){
                    this.user.Jobs.pop();
                }
            }
        };
    }]);

})();
