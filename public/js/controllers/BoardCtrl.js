(function(){
    angular.module('myApp.controllers')
        .controller('BoardCtrl', ['$scope', function($scope){
            $scope.updateTitle("Meet the Board");

            $scope.board =
                [
                    {
                        "name": "Mr. President",
                        "position": "President",
                        "phone": "555-5555",
                        "email": "pres@example.com",
                        "image": "../img/profile_pic.jpeg"
                    },
                    {
                        "name": "Mr. VP",
                        "position": "Vice President",
                        "phone": "555-5555",
                        "email": "vp@example.com",
                        "image": "../img/profile_pic.jpeg"
                    },
                    {
                        "name": "Mr. Secretary",
                        "position": "Secretary",
                        "phone": "555-5555",
                        "email": "secretary@example.com",
                        "image": "../img/profile_pic.jpeg"
                    },
                    {
                        "name": "Mr. Treasurer",
                        "position": "Treasurer",
                        "phone": "555-5555",
                        "email": "tresurer@example.com",
                        "image": "../img/profile_pic.jpeg"
                    }
                ];
    }]);
})();