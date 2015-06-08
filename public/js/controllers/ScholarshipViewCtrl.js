/**
 * Created by abe on 5/26/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('ScholarshipViewCtrl', ['$scope', 'Scholar','$mdToast', '$http', 'FileDownload', '$mdDialog',
        function($scope, Scholar, $mdToast, $http, FileDownload, $mdDialog) {
            $scope.updateTitle('PTO Scholarships');
            $scope.scholarships = Scholar.query();

            console.log($scope.scholarships);

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
                {title: 'gpa'}
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

                }).catch(function(err){
                    console.log(err);
                });

            };

            $scope.exportSingle = function(data, ev) {
                var ids = [];
                data.forEach(function(el){
                    if (el.$checked){
                        ids.push(el.id);
                    }
                });

                if (ids.length > 1) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('Warning')
                            .content('You can only export one scholarship at a time')
                            .ok('OK')
                            .targetEvent(ev)
                    );
                    return;
                }

                $http({
                    url: '/api/scholarships/'+ids[0]+'?mode=docx',
                    method: 'GET',
                    responseType: 'arraybuffer'
                }).then(function(data) {
                        console.log(data);

                        var cd = data.headers('Content-Disposition');
                        var idx = cd.indexOf('filename="') + 'filename="'.length;

                        var filename = cd.slice(idx, -1);
                        var mime = data.headers('Content-Type');

                        FileDownload(data.data, {filename: filename, mime: mime, type: 'arraybuffer'});
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        }]);
})();
