(function(){
    var appControllers = angular.module('appControllers', []);

    appControllers.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function(){
                    $log.debug("toggle left done")
                });
        };
    });

    appControllers.controller('MembershipCtrl', ['$scope', function($scope){
       /* $scope.card = new Card({
            form: 'userForm',
            container: '.card-wrapper',
            formSelectors: {
                numberInput: 'input#payment-number',
                expiryInput: 'input#payment-exp',
                cvcInput: 'input#payment-cvc',
                nameInput: 'input#payment-first, input#payment-last'
            },

            formatting: true,

            messages: {
                validDate: 'valid\ndate', // optional - default 'valid\nthru'
                monthYear: 'mm/yy', // optional - default 'month/year'
            },
            debug: true
        });*/
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
    }]);
	
	appControllers.controller('ScholarshipCtrl', ['$scope', function($scope){
       /* $scope.card = new Card({
            form: 'userForm',
            container: '.card-wrapper',
            formSelectors: {
                numberInput: 'input#payment-number',
                expiryInput: 'input#payment-exp',
                cvcInput: 'input#payment-cvc',
                nameInput: 'input#payment-first, input#payment-last'
            },

            formatting: true,

            messages: {
                validDate: 'valid\ndate', // optional - default 'valid\nthru'
                monthYear: 'mm/yy', // optional - default 'month/year'
            },
            debug: true
        });*/
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
    }]);
	
})();
