/**
 * Created by abe on 5/26/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('ScholarshipViewCtrl', ['$scope', 'Scholar','$mdToast', '$http', 'FileDownload', function($scope, Scholar, $mdToast, $http, FileDownload) {
            $scope.updateTitle('PTO Scholarships');
            $scope.scholarships = Scholar.query();

            $scope.scholarshipHeaders = [
                {title: 'Scholarship Id'},
                {title: 'Last Name'},
                {title: 'First Name'},
                {title: 'Middle Name'},
                {title: 'Address'},
                {title: 'City'},
                {title: 'State'},
                {title: 'Zip Code'},
                {title: 'Phone Number'},
                {title: 'Email Address'},
                {title: 'gpa'},
                {title: 'Activity Ids'},
                {title: 'Class Ids'},
                {title: 'Employment Ids'},
                {title: 'Honors Ids'}
            ];
        }])
})();
