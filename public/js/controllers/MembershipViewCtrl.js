/**
 * Created by 31160 on 4/16/2015.
 */
angular.module('myApp.controllers')
    .controller('MembershipViewCtrl', ['$scope', 'Member', 'Student', '$mdToast', function($scope, Member, Student, $mdToast){
        $scope.updateTitle('PTO Members');
        $scope.members = Member.query();
        $scope.students = Student.query();
        $scope.data = {};

        $scope.memberHeaders = [
            {title:'Membership Id'},
            {title:'Last Name'},
            {title:'First Name'},
            {title:'Address'},
            {title:'City'},
            {title:'State'},
            {title:'Zip Code'},
            {title:'Linked Students', description:"id's of students with this parent"}
        ];

        $scope.studentHeaders = [
            {title:'Student Id'},
            {title:'First Name'},
            {title:'Last Name'},
            {title:'Grade'},
            {title:'Unit'},
            {title:'Parent Id', description:"id of parent member"}
        ];

        $scope.exportSelected = function(data, apiUrl){
            var ids = [];
            data.forEach(function(el){
                if (el.$checked){
                    ids.push(el.id);
                }
            });

            window.open('/api/'+apiUrl+'?mode=csv&ids='+ids.join(','), '_blank', '');
        };

        $scope.addRandomItem = function addRandomItem() {
            $scope.members.push(generateRandomItem());
        };

        $scope.deleteSelected = function(deletedItems){
            var message = deletedItems.length == 1 ? '1 Row Deleted' : deletedItems.length + ' Rows Deleted';

            var backup = [];
            angular.copy($scope.data, backup);
            backup = backup.filter(function(val){
                if (val.$checked) delete val.$checked;
                return val;
            });

            var toast = $mdToast.simple()
                .content(message)
                .action('UNDO')
                .highlightAction(true)
                .position('bottom left')
                .hideDelay(4000);

            $mdToast.show(toast).then(function(){
                $scope.members = Member.query();
                $scope.students = Student.query();
            });
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
                id: 2,
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