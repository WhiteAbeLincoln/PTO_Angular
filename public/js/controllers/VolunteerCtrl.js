(function() {
    angular.module('myApp.controllers')
        .controller('VolunteerCtrl', ['$scope', '$log', '$http', 'Volunteer', function($scope, $log, $http, Volunteer){
			$scope.updateTitle("Volunteer Application");

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
				"phone":"",
				"email":"",
				"sfact": [
					{
						"c1": false,
						"c2": false,
						"c3": false,
						"c3m": false,
						"c3t": false,
						"c3w": false,
						"c3th": false,
						"c3f": false,
						"c4": false,
						"c4m": false,
						"c4t": false,
						"c4w": false,
						"c4th": false,
						"c4f": false,
						"c5": false,
						"c6": false,
						"c7": false
					}
				],
				"wact": [
					{
						"c1": false,
						"c2": false,
						"c3": false,
						"career":"",
						"c4": false,
						"c4m": false,
						"c4t": false,
						"c4w": false,
						"c4th": false,
						"c4f": false,
						"c5": false,
						"c6": false,
						"c7": false
					}
				],
				"sact": [
					{
						"c1": false,
						"c1m": false,
						"c1t": false,
						"c1w": false,
						"c1th": false,
						"c1f": false,
						"c2": false,
						"c3": false
					}
				],
				"oact": [
					{
						"c1": false,
						"c1m": false,
						"c1t": false,
						"c1w": false,
						"c1th": false,
						"c1f": false,
						"c2": false,
						"c2m": false,
						"c2t": false,
						"c2w": false,
						"c2th": false,
						"c2f": false,
						"c3": false,
						"c4": false,
						"c5": false,
						"c6": false,
						"c7": false
					}
				]
			};

			$scope.newVolunteer = function() {
				$scope.postData = {};
				$scope.postData.user = $scope.user;
				$scope.volunteer = new Volunteer($scope.postData);

				$log.debug($scope.postData);

				//sends the post data to the server.
				$scope.volunteer.$save();
			}
    }]);

})();