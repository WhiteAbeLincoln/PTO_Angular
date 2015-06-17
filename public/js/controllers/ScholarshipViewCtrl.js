/**
 * Created by abe on 5/26/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('ScholarshipViewCtrl', ['$scope', 'Scholar','$mdToast', '$http', 'FileDownload', '$mdDialog', '$timeout',
        function($scope, Scholar, $mdToast, $http, FileDownload, $mdDialog, $timeout) {
            $scope.updateTitle('PTO Scholarships');

            function load() {
                $scope.scholarships = Scholar.query();
            }

            load();

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
            };

            $scope.deleteSelected = function(deletedItems, table) {
                var message = deletedItems.length == 1 ? '1 Row Deleted' : deletedItems.length + ' Rows Deleted';

                var toast = $mdToast.simple()
                    .content(message)
                    .action('UNDO')
                    .highlightAction(true)
                    .position('bottom left')
                    .hideDelay(4000);

                var timeout = $timeout(function() {
                    $http.delete(constructUrl(deletedItems, table));
                    load();
                }, 4001);

                $mdToast.show(toast).then(function() {
                    $timeout.cancel(timeout);
                    load();
                });
            };

            function constructUrl(data, apiUrl, mode) {
                var ids = [];
                data.forEach(function(el){
                    if (el.$checked){
                        ids.push(el.id);
                    }
                });

                if (apiUrl && apiUrl.length) {
                    apiUrl = '?sub='+apiUrl+'&';
                } else {
                    apiUrl = '?'
                }

                if (mode) {
                    mode = 'mode='+mode+'&';
                } else {
                    mode = '';
                }

                return '/api/scholarships'+apiUrl+mode+'ids='+ids.join(',');
            }
        }]);
})();
