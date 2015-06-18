(function(angular) {
    angular.module('myApp.controllers')
        .controller('BoardCtrl', ['$scope', function($scope){
            $scope.updateTitle("Meet the Board");

            $scope.board =
                [
                    {
                        "name": "Brent Moore",
                        "position": "President",
                        "phone": "(937) 672-5460",
                        "email": "Brent@eaglemarketingllc.com",
                        "image": "../img/profile_pic.jpeg"
                    },
                    {
                        "name": "Talmadge \"Tal\" Gaither",
                        "position": "Vice President",
                        "phone": "(210) 632-8343",
                        "email": "tgaither2@woh.rr.com",
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
})(window.angular);
