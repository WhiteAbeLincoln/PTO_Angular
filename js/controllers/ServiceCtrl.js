(function(){
    angular.module('myApp.controllers')
        .controller('ServiceCtrl', ['$scope', '$log', '$http', 'Service', function($scope, $log, $http, Service){
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
			"essay":"",
			"Activity": [
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
			"description":"",
			"location":"",
			"position":"",
			"nine":"",
			"ten":"",
			"eleven":"",
			"twelve":"",
			"total":"",
			"commitment":"",
			"adult":"",
			"relation":""
        };
		$scope.changeActivity = function(num){
            var oldLength = this.user.Activity.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.Activity.push({
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
                    this.user.Activity.pop();
                }
            }
        };
		
        $scope.newServer = function() {
            $scope.postData = {};
            $scope.postData.user = $scope.user;
            $scope.server = new Service($scope.postData);

            $log.debug($scope.postData);

            //sends the post data to the server.
            $scope.server.$save();
        }
    }]);
})();