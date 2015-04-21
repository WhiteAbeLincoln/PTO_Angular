/**
 * Created by abe on 3/5/15.
 */
(function () {
    angular.module('myApp.controllers')
        .controller('DownloadCtrl', ['$scope', 'Download', 'ICON_STYLES', '$mdDialog', '$mdToast', '$timeout', '$window', function ($scope, Download, ICON_STYLES, $mdDialog, $mdToast, $timeout, $window) {
            $scope.updateTitle("Downloads");
            $scope.debug = {};
            $scope.user = $scope.currentUser;

            $scope.iconStyles = ICON_STYLES;
            $scope.dltypes = Download.get();

            $scope.createDownload = function (ev){
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    controller: 'CreateDownloadCtrl',
                    templateUrl: 'partials/admin/download.tmpl.html',
                    targetEvent: ev
                }).then(function(answer){
                    var dl = new Download(answer);
                    dl.$save(function(data, headers){

                        console.log(JSON.stringify(data));

                        angular.forEach(data, function(value, key){
                            console.log(JSON.stringify(value));
                            if (angular.isDefined($scope.dltypes[key]) && angular.isDefined(value)){
                                $scope.dltypes[key].push(value[0]);
                            } else if (angular.isDefined(value)) {
                                $scope.dltypes[key] = [];
                                $scope.dltypes[key].push(value[0]);
                            }

                        });
                    });
                }, function(){

                })
            };

            /**
             * Delete a download from the database and filesystem
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
                }, 4001);

                var backup = removeFromList(id, type);
                $mdToast.show(toast).then(function(){
                    $timeout.cancel(pDelete);
                    restoreToList(backup);
                });
            };

            $scope.expanded = null;

            $scope.checkExpanded = function(typeIndex, dl, expanded) {
                return angular.equals({id: dl.id, category:typeIndex}, expanded);
            };

            $scope.expandLong = function(typeIndex, dl) {

                $scope.expanded =
                    $scope.checkExpanded(typeIndex, dl, $scope.expanded)
                    ? null
                    : {id: dl.id, category: typeIndex};


            };

            $scope.getDownload = function(id, name) {
                //bit hacky, but it works
                if ($scope.user) {
                    $scope.deleteDownload(id, name);
                    return;
                }
                $window.location = 'api/downloads/'+id;
            };


            /**
             * Removes the download object from the list of downloads
             * @param id {number} id of the download to be removed
             * @param type {string} type of the download to be removed
             * @returns {{}|{obj: *, index: number, type: string}}
             */
            function removeFromList(id, type){
                var backup = {};

                angular.forEach($scope.dltypes[type], function(obj, index){
                    if (obj.id == id){
                        backup.obj = angular.copy(obj);       //creates a new reference
                        backup.index = index;
                        backup.type = type;
                        this.splice(index, 1);
                    }
                }, $scope.dltypes[type]);

                if ($scope.dltypes[type].length == 0){
                    delete $scope.dltypes[type];
                }

                return backup;      //if length is 0 return null else backup
            }

            /**
             * Restores a download to the list from the backup object
             * @param backup {{obj: *, index: number, type: string}} backup to be restored
             */
            function restoreToList(backup){
                if (angular.isDefined(backup.index)) {
                    if (angular.isDefined($scope.dltypes[backup.type])){
                        $scope.dltypes[backup.type].splice(backup.index, 0, backup.obj);
                    } else {
                        $scope.dltypes[backup.type] = [];
                        $scope.dltypes[backup.type].push(backup.obj);
                    }
                }
            }

        }]);
})();
