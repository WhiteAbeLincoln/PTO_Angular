/**
 * Created by 31160 on 4/16/2015.
 */
angular.module('myApp.controllers')
    .controller('MembershipViewCtrl', ['$scope', 'Member', '$mdToast', '$http', 'FileDownload', function($scope, Member, $mdToast, $http, FileDownload){
        $scope.updateTitle('PTO Members');
        $scope.members = Member.query();
        $scope.students = Member.query({sub: 'students'});
        $scope.payments = Member.query({sub: 'payments'});

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

        $scope.paymentHeaders = [
            {title:'Payment Id'},
            {title:'Stripe Charge'},
            {title:'First Name'},
            {title:'Last Name'},
            {title:'Amount'},
            {title:'Parent Id', description:"id of parent member"}
        ];

        $scope.exportSelected = function(data, apiUrl) {
            var ids = [];
            data.forEach(function(el){
                if (el.$checked){
                    ids.push(el.id);
                }
            });

            if (apiUrl.length){
                apiUrl = '?sub='+apiUrl+'&';
            } else {
                apiUrl = '?'
            }

            $http.get('/api/members'+apiUrl+'mode=csv&ids='+ids.join(',')).then(function(data){
                console.log(data);
                FileDownload(data.data, {filename: 'export.csv', mime: 'text/csv'});
            }).catch(function(err){
                console.log(err);
            });

        };

        $scope.deleteSelected = function(deletedItems) {
            var message = deletedItems.length == 1 ? '1 Row Deleted' : deletedItems.length + ' Rows Deleted';

            var toast = $mdToast.simple()
                .content(message)
                .action('UNDO')
                .highlightAction(true)
                .position('bottom left')
                .hideDelay(4000);

            $mdToast.show(toast).then(function(){
                $scope.members = Member.query();
                $scope.students = Member.query({sub:'students'});
            });
        };
    }]);