/**
 * Created by 31160 on 4/16/2015.
 */
angular.module('myApp.controllers')
    .controller('MembershipViewCtrl', ['$scope', 'Member', 'Student', function($scope, Member, Student){
        $scope.members = Member.query();
        $scope.students = Student.query();
        $scope.data = {};


        $scope.addRandomItem = function addRandomItem() {
            $scope.members.push(generateRandomItem());
        };

        function generateRandomItem() {
            var firstname = "Abe";
            var lastname = "White";
            var address = "123 Abc Rd";
            var city = "Centerville";
            var state = "OH";
            var zip = "45459";
            var linked = "1,2,3,4";

            return {
                membershipId: 2,
                firstName: firstname,
                lastName: lastname,
                address: address,
                city: city,
                state: state,
                zipCode: zip,
                studentIds: linked
            }
        }
    }]);