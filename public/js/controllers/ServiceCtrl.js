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
			"activities": [
                {
                        name: "",
						description:"",
						location:"",
						position:"",
						nine:"",
						ten:"",
						eleven:"",
						twelve:"",
						commitment:"",
						adult:"",
						relation:"",
						adultAddress:"",
						adultCity:"",
						adultState:"",
						adultPostalCode:"",
						adultPhone:"",
						adultEmail:""
                    }
            ]
        };
		$scope.changeActivity = function(num){
            var oldLength = this.user.activities.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.activities.push({
                        name: "",
						description:"",
						location:"",
						position:"",
						nine:"",
						ten:"",
						eleven:"",
						twelve:"",
						total:"",
						commitment:"",
						adult:"",
						relation:"",
						adultAddress:"",
						adultCity:"",
						adultState:"",
						adultPostalCode:"",
						adultPhone:"",
						adultEmail:""
                    });
                }
            } else {
                for (var i = 0; i < (oldLength - num); i++){
                    this.user.activities.pop();
                }
            }
        };
		
        $scope.newServer = function() {
            for(var i = 0; i < $scope.user.activities.length; i++){
                var a = $scope.user.activities[i];
                $scope.user.activities[i].total = a.nine + a.ten + a.eleven + a.twelve;
            }

            $scope.postData = {};
            $scope.postData.user = $scope.user;
            $scope.server = new Service($scope.postData);

            $log.debug($scope.postData);

            //sends the post data to the server.
            $scope.server.$save();
        }
    }]);
})();
