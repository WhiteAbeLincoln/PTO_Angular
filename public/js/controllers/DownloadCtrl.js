/**
 * Created by abe on 3/5/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('DownloadCtrl', ['$scope', 'Download', 'ICON_STYLES', '$mdDialog', '$mdToast', '$timeout', function ($scope, Download, ICON_STYLES, $mdDialog, $mdToast, $timeout) {
            $scope.updateTitle("Downloads");

            $scope.user = $scope.currentUser;

            $scope.iconStyles = ICON_STYLES;
            $scope.dltypes = Download.get();

            $scope.createDownload = function (ev){
                $mdDialog.show({
                    controller: 'CreateDownloadCtrl',
                    templateUrl: 'partials/admin/download.tmpl.html',
                    targetEvent: ev
                }).then(function(answer){
                    var dl = new Download(answer);
                    dl.$save(function(data, headers){
                        angular.forEach(data, function(value, key){

                            if (angular.isDefined($scope.dltypes[key])){
                                $scope.dltypes[key].push(value[0]);
                            } else {
                                $scope.dltypes[key] = [];
                                $scope.dltypes[key].push(value[0]);
                            }

                        });
                    });
                }, function(){

                })
            };

            /**
             * Delete a file, or a directory and all sub-files, from the zip
             * @param {number} id the id of the download to delete
             * @param {string} type the type of the download
             */
            $scope.deleteDownload = function(id, type){
                var toast = $mdToast.simple()
                    .content('Download Deleted')
                    .action('UNDO')
                    .highlightAction(true)
                    .position('bottom left')
                    .hideDelay(4000);

                var pDelete = $timeout(function(){
                    Download.delete({id: id});
                    angular.forEach($scope.dltypes[type], function(obj, index){
                        if (obj.id == id){
                            this.splice(index, 1);
                        }
                    }, $scope.dltypes[type]);

                    if ($scope.dltypes[type].length == 0){
                        delete $scope.dltypes[type];
                    }

                }, 4001);

                $mdToast.show(toast).then(function(){
                    alert('UNDO '+id);
                    $timeout.cancel(pDelete);
                });


            };

        }]);
})();
