(function(){
    angular.module('myApp.controllers')
        .controller('BoardCtrl', ['$scope', '$log', '$http', 'Board', function($scope, $log, $http, Board){
        $scope.num = 0;
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
            "homephone":"",
			"workphone":"",
            "email":"",
			"essay":"",
			"Children": [
                {
                    "name": "",
					"school": ""
                }
            ],
			"daymorn": false,
			"endmorn": false,
			"dayafter": false,
			"endafter": false,
			"dayeve": false,
			"endeve": false,
			"volcoor":"",
			"newsweb":"",
			"fair":"",
			"tours":"",
			"hos":"",
			"member":"",
			"event":"",
			"scholar":"",
			"fund":"",
			"or":"",
			"mail":"",
			"pride":"",
			"skills":"",
			"experience":"",
			"why":"",
			"position":''
        };
		$scope.changeChildren = function(num){
            var oldLength = this.user.Children.length;
            if (num > oldLength){
                for (var i = 0; i < (num - oldLength); i++){
                    this.user.Children.push({
                        "name": "",
						"school": ""
                    });
                }
            } else {
                for (var i = 0; i < (oldLength - num); i++){
                    this.user.Children.pop();
                }
            }
        };	
		
        $scope.newBoard = function() {
            $scope.postData = {};
            $scope.postData.user = $scope.user;
            $scope.board = new Board($scope.postData);

            $log.debug($scope.postData);

            //sends the post data to the server.
            $scope.board.$save();
        }
    }]);
})();